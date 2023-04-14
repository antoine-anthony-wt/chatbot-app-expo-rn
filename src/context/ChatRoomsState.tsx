// src/context/ChatRooms.tsx
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config.js';

/**
 * Interface for the ChatRoomsContext.
 * @typedef {Object} ChatRoomsContextType
 * @property {Map<string, IMessage[]>} messagesMap - A map of chat room IDs to arrays of messages.
 * @property {Function} updateMessagesForChatRoom - Function to update messages for a chat room.
 * @property {string} chatbotName - The name of the chatbot.
 * @property {Function} setChatbotName - Function to set the name of the chatbot.
 * @property {number} chatbotId - The ID of the chatbot.
 * @property {Function} setChatbotId - Function to set the ID of the chatbot.
 * @property {string} chatRoomId - The ID of the current chat room.
 * @property {Function} setChatRoomId - Function to set the ID of the current chat room.
 * @property {Function} sendMessage - Function to send a message to the chatbot.
 */
interface ChatRoomsContextType {
  messagesMap: Map<string, IMessage[]>;
  updateMessagesForChatRoom: (
    chatRoomId: string,
    newMessages: IMessage[],
  ) => void;
  chatbotName: string;
  setChatbotName: (name: string) => void;
  chatbotId: number;
  setChatbotId: (id: number) => void;
  chatRoomId: string;
  setChatRoomId: (id: string) => void;
  sendMessage: (chatRoomId: string, newMessages: IMessage[]) => Promise<string>;
}

// Create a context for chat rooms
const ChatRoomsContext = createContext({} as ChatRoomsContextType);

// Define the ChatRoomsProvider component
export const ChatRoomsProvider: React.FC = ({ children }) => {
  const [messagesMap, setMessagesMap] = useState<Map<string, IMessage[]>>(
    new Map(),
  );
  const [chatbotName, setChatbotName] = useState<string>('');
  const [chatbotId, setChatbotId] = useState<number>(0);
  const [chatRoomId, setChatRoomId] = useState<string>('');

  /**
   * Sends a message to the chatbot and returns its text and voice responses.
   * @async
   * @param {string} chatRoomId - The chat room ID.
   * @param {IMessage[]} newMessages - The new messages to send.
   * @returns {Promise<{ chatTextResponse: string; chatVoiceResponse: string }>} The chatbot's text and voice responses.
   */
  const sendMessage = async (
    chatRoomId: string,
    newMessages: IMessage[],
  ): Promise<{ chatTextResponse: string; chatVoiceResponse: string }> => {
    try {
      const userInput = newMessages[0]?.text;

      if (!userInput) {
        throw new Error('No text input found in newMessages');
      }

      const textResponse = await axios.post(config.chatAPI, {
        user_input: userInput,
      });

      const chatTextResponse: string = textResponse.data?.text;

      const voiceResponse = await axios.post(config.chatVoiceAPI, {
        text_completion: chatTextResponse,
      });

      const chatVoiceResponse: string = voiceResponse.data?.voice;

      if (!chatTextResponse) {
        throw new Error('No response found');
      }

      if (!chatVoiceResponse) {
        throw new Error('No voice response found');
      }

      return { chatTextResponse, chatVoiceResponse };
    } catch (error) {
      console.error('Error in sendMessage function:', error);
      throw error;
    }
  };

  /**
   * Saves the chat data to AsyncStorage.
   * @async
   */
  const saveChatData = async () => {
    try {
      await AsyncStorage.setItem(
        'chatData',
        JSON.stringify(Array.from(messagesMap.entries())),
      );
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  /**
   * Loads the chat data from AsyncStorage.
   * @async
   */
  const loadChatData = async () => {
    try {
      const chatData = await AsyncStorage.getItem('chatData');
      if (chatData !== null) {
        setMessagesMap(new Map(JSON.parse(chatData)));
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
    }
  };

  // Save chat data when messagesMap changes
  useEffect(() => {
    saveChatData();
  }, [messagesMap]);

  // Load chat data when component mounts
  useEffect(() => {
    loadChatData();
  }, []);

  /**Updates the messages for a chat room.
   *@callback
   *@param {string} chatRoomId - The chat room ID.
   *@param {IMessage[]} newMessages - The new messages to update.
   */
  const updateMessagesForChatRoom = useCallback(
    (chatRoomId: string, newMessages: IMessage[]) => {
      setMessagesMap((prevMessagesMap) => {
        const updatedMessages = GiftedChat.append(
          prevMessagesMap.get(chatRoomId) || [],
          newMessages,
        );
        return new Map(prevMessagesMap.set(chatRoomId, updatedMessages));
      });
    },
    [],
  );

  // Render the ChatRoomsContext.Provider component with the necessary values
  return (
    <ChatRoomsContext.Provider
      value={{
        messagesMap,
        updateMessagesForChatRoom,
        chatbotName,
        setChatbotName,
        chatbotId,
        setChatbotId,
        chatRoomId,
        setChatRoomId,
        sendMessage,
      }}>
      {children}
    </ChatRoomsContext.Provider>
  );
};

export default ChatRoomsContext;

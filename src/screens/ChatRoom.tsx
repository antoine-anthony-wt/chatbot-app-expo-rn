// src/screens/ChatRoom.tsx
import React, { useCallback, useContext } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from 'react-query';

import ChatRoomsContext from '../context/ChatRoomsState';
import { MessageAudio } from '../components/MessageAudio';

interface ChatRoomProps {}

const ChatRoom: React.FC<ChatRoomProps> = () => {
  const {
    chatRoomId,
    messagesMap,
    updateMessagesForChatRoom,
    chatbotName,
    chatbotId,
    sendMessage,
  } = useContext(ChatRoomsContext);

  const sendMessageMutation = useMutation((newMessages: IMessage[]) =>
    sendMessage(chatRoomId, newMessages),
  );

  const currentNewMessages = messagesMap.get(chatRoomId) || [];

  // Define the onSend function to send a message to the server
  const onSend = useCallback(
    async (newMessages: IMessage[]) => {
      updateMessagesForChatRoom(chatRoomId, newMessages);

      try {
        const {
          chatTextResponse,
          chatVoiceResponse,
        }: { chatTextResponse: string; chatVoiceResponse: string } =
          await sendMessageMutation.mutateAsync(newMessages);

        const userId = Math.round(Math.random() * 1000000);
        const botMessage: IMessage = {
          _id: userId,
          text: chatTextResponse,
          audio: chatVoiceResponse,
          createdAt: new Date(),
          user: { _id: chatbotId, name: chatbotName },
        };

        updateMessagesForChatRoom(chatRoomId, [botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [
      chatRoomId,
      sendMessageMutation,
      chatbotId,
      chatbotName,
      updateMessagesForChatRoom,
    ],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={currentNewMessages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        renderMessageAudio={(props) => (
          <MessageAudio currentMessage={props.currentMessage} />
        )}
        isTyping={sendMessageMutation.isLoading}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;

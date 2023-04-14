// src/screens/ChatRoomList.tsx
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Button, FlatList } from 'react-native';
import ChatRoomsContext from '../context/ChatRoomsState';

interface ChatRoomListProps {}

const ChatRoomList: React.FC = ({}: ChatRoomListProps) => {
  const { setChatbotId, setChatbotName, setChatRoomId } =
    React.useContext(ChatRoomsContext);
  const navigation = useNavigation();
  const newChatRoomId = 1;

  const chatbots = [
    { id: 2, name: 'Chatbot 1' },
  ];

  const handleChoosingChatRoom = ({
    id,
    name,
  }: {
    id: number;
    name: string;
  }) => {
    setChatbotId(id);
    setChatbotName(name);
    setChatRoomId(newChatRoomId);
    navigation.navigate('ChatRoom');
  };
  return (
    <SafeAreaView>
      <View>
        <FlatList
          data={chatbots}
          renderItem={({ item }) => (
            <Button
              key={item.id}
              title={`Enter ${item.name}`}
              onPress={() => handleChoosingChatRoom(item)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatRoomList;

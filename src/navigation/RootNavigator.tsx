import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatRoom from '../screens/ChatRoom';
import ChatRoomList from '../screens/ChatRoomList';
import ChatRoomsContext from '../context/ChatRoomsState';

const Stack = createStackNavigator();

export function RootNavigator() {
  const { chatRoomId } = React.useContext(ChatRoomsContext);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ChatRoomList'>
        <Stack.Screen
          name='ChatRoomList'
          component={ChatRoomList}
          options={{ title: 'Select a Chatbot' }}
        />
        <Stack.Screen
          name='ChatRoom'
          component={ChatRoom}
          options={() => ({ title: `Chat Room ${chatRoomId}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

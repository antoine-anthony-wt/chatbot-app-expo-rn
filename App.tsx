// App.tsx is the entry point of the application
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import * as Updates from 'expo-updates';
import { Audio } from 'expo-av';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ChatRoomsProvider } from './src/context/ChatRoomsState';

const queryClient = new QueryClient();

const App: React.FC = () => {
  // Set the audio mode to play in silent mode on iOS
  React.useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    })();
  }, []);

  // Check for updates and reload the app if there are any
  React.useEffect(() => {
    (async () => {
      const { isAvailable } = await Updates.checkForUpdateAsync();
      if (isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    })();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ChatRoomsProvider>
        <RootNavigator />
      </ChatRoomsProvider>
    </QueryClientProvider>
  );
};

export default App;

/**
 * @file src/components/MessageAudio.tsx
 * A React component that renders a speaker icon to control the playback of chatbot audio messages.
 */

import React, { useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { useChatbotSound } from '../hooks/useChatSound';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Props for the MessageAudio component.
 */
interface MessageAudioProps {
  currentMessage?: IMessage;
}

/**
 * A React component that renders a speaker icon to control the playback of chatbot audio messages.
 * @param {Object} props - The properties for the MessageAudio component.
 * @returns {React.FC<MessageAudioProps>} - The rendered MessageAudio component.
 */
export const MessageAudio: React.FC<MessageAudioProps> = (props) => {
  const { loadSound, playSound, pauseSound } = useChatbotSound();
  const [isSoundPlaying, setIsSoundPlaying] = React.useState<boolean>(false);

  /**
   * Handles playing, pausing, and resuming the sound.
   * @param {string} mp3 - The audio content.
   */
  const handleSound = async (mp3: string) => {
    if (mp3) {
      if (!isSoundPlaying) {
        setIsSoundPlaying(true);
        await playSound();
      } else {
        setIsSoundPlaying(false);
        await pauseSound();
      }
    }
  };

  // Load the sound when the component mounts
  useEffect(() => {
    (async () => {
      await loadSound(props.currentMessage?.audio);
    })();
  }, []);

  return (
    <MaterialIcons
      name='speaker'
      // Handle sound playback control when the speaker icon is pressed
      onPress={() => handleSound(props.currentMessage?.audio)}
      size={24}
      // Change the color of the speaker icon based on the playback status
      color={isSoundPlaying ? 'blue' : 'black'}
    />
  );
};

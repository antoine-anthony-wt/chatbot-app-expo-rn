/**
 * @file src/hooks/useChatSound.ts
 * A custom React Hook that handles playing, pausing, resuming, and restarting chatbot sound.
 */

import * as React from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

/**
 * A custom React Hook that handles playing, pausing, resuming, and restarting chatbot sound.
 * @returns {Object} - An object containing the loadSound, playSound, and pauseSound functions.
 */
export function useChatbotSound() {
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [positionMillis, setPositionMillis] = React.useState<number>(0);

  /**
   * Loads the sound from the given binary audio content.
   * @param {string} audioContent - The binary audio content.
   */
  const loadSound = React.useCallback(async (audioContent: string) => {
    // Convert binary content to base64
    const base64AudioContent = Buffer.from(audioContent, 'binary').toString('base64');

    // Save audio content to a local file
    const audioFileURI = FileSystem.documentDirectory + 'audio.mp3';
    await FileSystem.writeAsStringAsync(audioFileURI, base64AudioContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Load the sound from the local file
    const { sound } = await Audio.Sound.createAsync({ uri: audioFileURI });

    // Set the playback status update listener to handle when the sound finishes playing
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await sound.stopAsync();
      }
    });

    setSound(sound);
  }, []);

  /**
   * Plays the sound. If the sound is not playing, it will start playing from the positionMillis.
   * If the sound has finished playing, it will replay from the beginning.
   */
  const playSound = React.useCallback(async () => {
    if (sound && positionMillis !== 0) {
      await sound.playFromPositionAsync(positionMillis);
    } else if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.didJustFinish || !status.isPlaying) {
          await sound.replayAsync();
        } else {
          await sound.playAsync();
        }
      }
    }
  }, [sound, positionMillis]);

  /**
   * Pauses the sound, if it is currently playing, and sets the positionMillis state.
   */
  const pauseSound = React.useCallback(async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      setPositionMillis(status.positionMillis);
      await sound.pauseAsync();
    }
  }, [sound]);

  return { loadSound, playSound, pauseSound };
}

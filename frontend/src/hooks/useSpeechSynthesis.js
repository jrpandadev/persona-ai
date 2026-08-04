import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    // Ensure voices are loaded (sometimes takes a moment on load)
    if (synth) {
      synth.onvoiceschanged = () => {
        synth.getVoices();
      };
    }
    return () => {
      if (synth) {
        synth.cancel(); // Stop playing on unmount
      }
    };
  }, [synth]);

  // Strip basic markdown to make speech natural
  const cleanMarkdownForSpeech = (text) => {
    if (!text) return '';
    return text
      .replace(/(\*|_|#|`|>)/g, '') // Remove basic markdown symbols
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Extract text from links
      .replace(/\n+/g, '. '); // Replace newlines with pauses
  };

  const speak = useCallback((text) => {
    if (!synth) return;
    
    // Stop any current speech
    synth.cancel();
    
    const cleanText = cleanMarkdownForSpeech(text);
    if (!cleanText.trim()) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Attempt to pick an English voice
    const voices = synth.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
         console.error('Speech synthesis error:', e);
         setIsPlaying(false);
      }
    };

    currentUtteranceRef.current = utterance;
    synth.speak(utterance);
  }, [synth]);

  const stop = useCallback(() => {
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
    }
  }, [synth]);

  return { isPlaying, speak, stop };
}

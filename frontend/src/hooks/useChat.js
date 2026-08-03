import { useState, useRef, useCallback, useEffect } from 'react';
import { sendChatMessageStream } from '../services/api';
import { trackQuestionAsked } from '../utils/analytics';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content:
    "Hey! I'm Jyoti's AI assistant. Ask me anything about his projects, skills, or experience — or pick a question below to get started.",
};

/**
 * Custom hook encapsulating all chat logic:
 * - Message state management
 * - Streaming API calls
 * - Auto-scroll via ref
 * - Loading / error states
 * - Request cancellation via AbortController
 */
export function useChat(jobDescription = null) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAnchorRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup pending requests if component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSend = useCallback(
    async (overrideQuestion) => {
      const question = (overrideQuestion ?? input).trim();
      if (!question) return;

      // Cancel any ongoing request before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setInput('');

      // Build history from current messages
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add user message
      setMessages((prev) => [...prev, { role: 'user', content: question }]);
      trackQuestionAsked();
      setIsLoading(true);

      // Placeholder for streaming assistant response
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      try {
        await sendChatMessageStream(
          question, 
          history, 
          jobDescription, 
          (chunk) => {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated.length - 1;
              updated[last] = {
                ...updated[last],
                content: updated[last].content + chunk,
              };
              return updated;
            });
          },
          signal
        );
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('Request was cancelled');
          return; // Do nothing if we intentionally aborted
        }
        
        console.error('Chat error:', err);
        const userFacingMessage = err.message
          ? `Sorry, I ran into an issue: ${err.message}`
          : 'Sorry, I ran into an issue connecting to the server. Please try again.';

        setMessages((prev) => {
          const updated = [...prev];
          const last = updated.length - 1;
          updated[last] = {
            role: 'assistant',
            content: userFacingMessage,
          };
          return updated;
        });
      } finally {
        if (abortControllerRef.current?.signal === signal) {
          setIsLoading(false);
        }
      }
    },
    [input, messages, jobDescription]
  );

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsLoading(false);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
    clearChat,
    scrollAnchorRef,
  };
}

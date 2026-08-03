import { useState, useRef, useCallback } from 'react';
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
 *
 * Keeps ChatBox as a pure presentation component.
 */
export function useChat(jobDescription = null) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAnchorRef = useRef(null);



  const handleSend = useCallback(
    async (overrideQuestion) => {
      const question = (overrideQuestion ?? input).trim();
      if (!question || isLoading) return;

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
        await sendChatMessageStream(question, history, jobDescription, (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated.length - 1;
            updated[last] = {
              ...updated[last],
              content: updated[last].content + chunk,
            };
            return updated;
          });
        });
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated.length - 1;
          updated[last] = {
            role: 'assistant',
            content:
              'Sorry, I ran into an issue connecting to the server. Please try again.',
          };
          return updated;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, jobDescription]
  );

  const clearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
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

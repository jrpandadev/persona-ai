import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { PromptChips } from './PromptChips';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

/**
 * Chat interface — pure presentation component.
 * All business logic lives in the useChat hook.
 *
 * Features:
 * - Streaming AI responses
 * - Suggested prompt chips (before first user message)
 * - Animated typing indicator
 * - Glassmorphism design
 * - Accessible labels
 */
const PLACEHOLDERS = [
  'Ask me anything...',
  'Ask about CareerLens AI...',
  'Explain CareerLens AI...',
  'Show your projects...',
  'Why should we hire you?',
  'What technologies do you know?',
];

export function ChatBox({ jobDescription }) {
  const { messages, input, setInput, isLoading, handleSend, clearChat } = useChat(jobDescription);
  const messagesContainerRef = useRef(null);
  
  const [baseInput, setBaseInput] = useState('');
  const { isListening, transcript, error: speechError, toggleListening } = useSpeechRecognition();

  useEffect(() => {
    if (isListening) {
      setInput((baseInput ? baseInput + ' ' : '') + transcript);
    }
  }, [transcript, isListening, baseInput, setInput]);

  const handleToggleListening = () => {
    if (!isListening) {
      setBaseInput(input.trim());
    }
    toggleListening();
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Max height of 150px before scrolling
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Internal container auto-scroll on new message or streaming chunk
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div
      id="chat"
      className="
        w-full max-w-xl h-[560px] md:h-[600px] scroll-mt-28
        bg-surface-950/80 border border-white/8 backdrop-blur-2xl
        rounded-2xl flex flex-col relative overflow-hidden
        shadow-2xl shadow-black/40
      "
      role="region"
      aria-label="AI Chat"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="h-14 border-b border-white/8 flex items-center px-5 justify-between bg-white/[0.02] z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] flex-shrink-0">
            <img src="/avatar.png" alt="Jyoti" className="w-full h-full object-cover" style={{ objectPosition: '22% 15%' }} />
          </div>
          <div>
            <h3 className="font-mono text-xs text-white font-medium">
              Jyoti.AI Assistant
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Clear Chat Button */}
        {hasUserMessages && (
          <button
            onClick={clearChat}
            disabled={isLoading}
            className="
              px-2.5 py-1 text-[11px] font-mono text-gray-400 border border-white/10 rounded-md
              hover:text-white hover:border-red-400/40 hover:bg-red-500/10
              transition-all duration-200 disabled:opacity-30
            "
          >
            🗑 Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-grow px-5 py-4 overflow-y-auto flex flex-col gap-4 z-10">
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role}
            content={msg.content}
            index={idx}
            isStreaming={isLoading && idx === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}

        {/* Prompt chips — shown only before first user interaction */}
        {!hasUserMessages && !isLoading && (
          <PromptChips onSelect={(text) => handleSend(text)} />
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/8 bg-surface-950/60 z-10 backdrop-blur-md"
      >
        <div className="relative flex items-center">
          <label htmlFor="chat-input" className="sr-only">
            Type your question
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={PLACEHOLDERS[placeholderIdx]}
            autoComplete="off"
            className="
              w-full bg-white/[0.03] border border-white/8 rounded-xl
              py-3 pl-4 pr-24 text-sm text-white resize-none
              placeholder-gray-500
              focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05]
              transition-all duration-200 overflow-y-auto
              min-h-[44px]
            "
          />
          <div className="absolute right-3 bottom-1.5 flex items-center gap-1 h-8">
            <button
              type="button"
              onClick={handleToggleListening}
              title={speechError ? speechError : "Voice Input"}
              className={`
                w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-200
                ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}
                ${speechError ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              🎤
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="
                w-8 h-8 flex items-center justify-center
                bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed
                rounded-lg text-white text-sm
                hover:brightness-110 active:scale-90
                transition-all duration-200
              "
            >
              ➔
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessageStream } from '../../services/api';

export function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Jyoti's AI assistant. How can I help you explore his work today? You can ask about his projects, skills, or download his CV."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuestion = input.trim();
    setInput('');

    // Prepare current history for backend
    const currentHistory = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Add user message to UI
    setMessages((prev) => [...prev, { role: 'user', content: userQuestion }]);
    setIsLoading(true);

    // Placeholder assistant message for streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      await sendChatMessageStream(userQuestion, currentHistory, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + chunk
          };
          return updated;
        });
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          role: 'assistant',
          content: 'Sorry, I ran into an issue connecting to the AI backend server.'
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="chat" className="w-full max-w-lg h-[600px] bg-neutral-950/80 border border-white/10 backdrop-blur-2xl rounded-2xl flex flex-col relative overflow-hidden shadow-2xl">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center border border-white/10 text-cyan-400 font-bold">
            AI
          </div>
          <div>
            <h3 className="font-mono text-xs text-white">Jyoti.AI Assistant</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatScrollRef} className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 z-10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-neutral-800 border-white/10 text-white'
                  : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
              }`}
            >
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>
            <div
              className={`rounded-2xl p-4 text-sm max-w-[85%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-neutral-900/90 border border-white/10 text-gray-200 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex-shrink-0 flex items-center justify-center border border-indigo-500/30 text-indigo-400 text-xs font-bold">
              AI
            </div>
            <div className="bg-neutral-900/90 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center justify-center h-[48px] w-[60px]">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/40 z-10 backdrop-blur-md">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full bg-neutral-900/50 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-8 h-8 flex items-center justify-center bg-indigo-600 disabled:opacity-50 rounded-full text-white hover:brightness-110 transition-all active:scale-95"
          >
            ➔
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

/**
 * Single chat message bubble.
 * Features:
 * - User vs assistant styling
 * - Markdown rendering for formatted AI text
 * - Copy button for AI responses
 * - Entrance animation
 */
export function ChatMessage({ role, content, index, isStreaming }) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const { isPlaying, speak, stop } = useSpeechSynthesis();

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
      className={`flex gap-3 group relative ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
          text-[10px] border overflow-hidden mt-0.5
          ${isUser
            ? 'bg-surface-800 border-white/10 text-white font-bold'
            : 'border-cyan-400/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
          }
        `}
        aria-hidden="true"
      >
        {isUser ? 'U' : <img src="/avatar.png" alt="JR AI" className="w-full h-full object-cover" style={{ objectPosition: '22% 15%' }} />}
      </div>

      {/* Bubble */}
      <div
        className={`
          rounded-2xl px-4 py-3 text-sm max-w-[85%] leading-relaxed relative
          ${isUser
            ? 'bg-surface-800 text-white rounded-tr-sm whitespace-pre-wrap'
            : 'bg-surface-900/80 border border-white/8 text-gray-200 rounded-tl-sm'
          }
        `}
      >
        {!content && isStreaming ? (
          <div className="flex gap-1.5 py-1 items-center h-5">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        ) : (
          <>
            {isUser ? (
              content
            ) : (
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-cyan-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            )}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 translate-y-[2px] bg-cyan-400 animate-pulse" />
            )}
          </>
        )}

        {/* Action Buttons for Assistant Messages */}
        {!isUser && content && !isStreaming && (
          <div className="mt-3 flex items-center gap-4 border-t border-white/5 pt-2">
            <button
              onClick={handleCopy}
              title="Copy message text"
              className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-cyan-300 transition-colors opacity-70 hover:opacity-100"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button
              onClick={() => isPlaying ? stop() : speak(content)}
              title={isPlaying ? "Stop listening" : "Listen to response"}
              className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 hover:text-indigo-400 transition-colors opacity-70 hover:opacity-100"
            >
              {isPlaying ? '⏹ Stop' : '🔊 Listen'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

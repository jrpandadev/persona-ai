import { motion } from 'framer-motion';

const SUGGESTIONS = [
  'Tell me about yourself',
  'What are your projects?',
  'What skills do you have?',
  'How can I contact you?',
];

/**
 * Suggested prompt chips shown when no user messages have been sent yet.
 * Clicking a chip sends that question directly via handleSend.
 */
export function PromptChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {SUGGESTIONS.map((text, i) => (
        <motion.button
          key={text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08 }}
          onClick={() => onSelect(text)}
          type="button"
          className="
            px-3.5 py-2 text-xs font-medium rounded-full
            bg-white/5 border border-white/10 text-gray-300
            hover:bg-cyan-400/10 hover:border-cyan-400/30 hover:text-cyan-300
            transition-all duration-200 cursor-pointer
            focus-ring
          "
        >
          {text}
        </motion.button>
      ))}
    </div>
  );
}

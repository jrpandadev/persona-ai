import { useEffect } from 'react';

export function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-surface-900 border border-cyan-500/30 text-cyan-300 text-sm font-mono rounded-xl shadow-2xl backdrop-blur-xl animate-fade-in">
      <span className="text-cyan-400">✨</span>
      <span>{message}</span>
    </div>
  );
}

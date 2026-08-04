import { useState } from 'react';
import { GlassCard } from '../UI/GlassCard';

export function JobContextPanel({ jobDescription, setJobDescription, onGenerateReport }) {
  const [inputText, setInputText] = useState('');

  const handleLoad = () => {
    if (inputText.trim()) {
      setJobDescription(inputText.trim());
    }
  };

  const handleRemove = () => {
    setInputText('');
    setJobDescription(null);
  };

  const isLoaded = !!jobDescription;

  return (
    <GlassCard className="w-full max-w-xl p-5 mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          💼 Job Description
        </h2>
        {isLoaded && (
          <button
            onClick={onGenerateReport}
            className="px-3 py-1.5 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white rounded-md transition-colors"
          >
            📄 Generate Interview Report
          </button>
        )}
      </div>

      {!isLoaded ? (
        <div className="flex flex-col gap-3">
          <textarea
            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none h-24"
            placeholder="Paste Job Description here to start Recruiter Mode..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleLoad}
              disabled={!inputText.trim()}
              className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-sm rounded-lg transition-colors"
            >
              Load Job Description
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
           <div className="text-xs text-gray-400 bg-black/20 p-3 rounded-xl border border-white/5 max-h-24 overflow-y-auto custom-scrollbar">
             {jobDescription}
           </div>
           <div className="flex justify-end">
             <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg transition-colors"
             >
               Remove Job Description
             </button>
           </div>
        </div>
      )}

    </GlassCard>
  );
}

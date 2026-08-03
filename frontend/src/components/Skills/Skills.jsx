import React from 'react';

const skills = [
  { name: 'PYTHON', category: 'Primary' },
  { name: 'FASTAPI', category: 'Backend' },
  { name: 'REACT', category: 'Frontend' },
  { name: 'LLM INTEGRATION', category: 'AI/ML' },
  { name: 'PROMPT ENGINEERING', category: 'AI/ML' },
  { name: 'GIT', category: 'Tools' },
  { name: 'UV', category: 'Tools' },
  { name: 'REST API', category: 'Architecture' },
];

export function Skills() {
  return (
    <div id="skills" className="w-full mt-6">
      <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Core Stack &amp; Technologies</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-3.5 py-1.5 rounded-full bg-white/5 text-cyan-300 font-mono text-xs border border-cyan-400/20 hover:border-cyan-400/50 transition-colors"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

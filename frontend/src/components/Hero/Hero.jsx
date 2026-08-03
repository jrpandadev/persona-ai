import React from 'react';

export function Hero() {
  return (
    <section className="w-full flex flex-col justify-center items-start pr-0 md:pr-12 lg:pr-24 py-12">
      <div className="mb-8 relative group">
        <div className="w-[200px] h-[200px] rounded-full relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl -z-10"></div>
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 glass-panel shadow-2xl relative z-10 shadow-[0_0_40px_rgba(76,215,246,0.3)] border-cyan-400/30">
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-4xl font-bold text-cyan-400">
              JP
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-cyan-400 rounded-full border-2 border-black animate-ping"></div>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight tracking-tight">
        Jyoti <br /> Ranjan Panda
      </h1>
      <h2 className="text-xl md:text-2xl text-cyan-400 mb-6 flex items-center gap-3 font-semibold">
        <span className="font-mono">&gt;_</span> AI Engineer | Mathematics &amp; Computing Student
      </h2>
      <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl leading-relaxed">
        Building AI-powered applications using Python, FastAPI, React, and LLMs. Dedicated to engineering precision and creating intelligent systems with a minimalist aesthetic.
      </p>

      <div className="flex flex-wrap gap-4 mb-12">
        <a 
          href="https://github.com/jrpandadev" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-500 text-white font-mono text-xs uppercase tracking-widest rounded shadow-lg hover:bg-indigo-600 active:scale-95 transition-all duration-300"
        >
          View GitHub
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/10 text-white font-mono text-xs uppercase tracking-widest rounded hover:border-white/40 hover:bg-white/5 active:scale-95 transition-all duration-300"
        >
          View LinkedIn
        </a>
      </div>
    </section>
  );
}

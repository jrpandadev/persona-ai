import React from 'react';

export function Navbar() {
  return (
    <nav className="bg-neutral-900/80 backdrop-blur-xl fixed top-0 w-full border-b border-white/10 z-50">
      <div className="flex justify-between items-center px-6 md:px-12 py-3 w-full max-w-[1200px] mx-auto">
        <a className="font-sans text-2xl font-extrabold tracking-tighter text-white hover:text-cyan-400 transition-colors" href="#">
          JYOTI.AI
        </a>
        <div className="hidden md:flex items-center space-x-8">
          <a className="text-gray-400 hover:text-white transition-colors" href="#projects">Projects</a>
          <a className="text-gray-400 hover:text-white transition-colors" href="#skills">Skills</a>
          <a className="text-gray-400 hover:text-white transition-colors" href="#chat">AI Chat</a>
          <a className="text-gray-400 hover:text-white transition-colors" href="#contact">Contact</a>
        </div>
        <button className="hidden md:inline-flex items-center justify-center px-6 py-2 bg-transparent border border-white/10 rounded hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-white font-mono text-xs uppercase tracking-widest active:scale-95">
          Download CV
        </button>
      </div>
    </nav>
  );
}

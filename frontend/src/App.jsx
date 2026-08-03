import React from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { Skills } from './components/Skills/Skills';
import { ChatBox } from './components/Chat/ChatBox';
import { Projects } from './components/Projects/Projects';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="pt-24 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 min-h-[calc(100vh-120px)]">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <Hero />
            <Skills />
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <ChatBox />
          </div>
        </div>

        <Projects />
      </main>

      <footer className="w-full py-8 border-t border-white/10 text-center text-xs font-mono text-gray-500">
        © 2026 Jyoti Ranjan Panda. Engineered with Precision.
      </footer>
    </div>
  );
}

export default App;
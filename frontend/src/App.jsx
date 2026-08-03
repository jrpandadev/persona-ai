import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { ChatBox } from './components/Chat/ChatBox';
import { JobMatchBox } from './components/JobMatch/JobMatchBox';
import { JobContextPanel } from './components/JobMatch/JobContextPanel';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';
import { Education } from './components/Education/Education';
import { Contact } from './components/Contact/Contact';
import { AnimatedSection } from './components/UI/AnimatedSection';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [jobDescription, setJobDescription] = useState('');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans relative overflow-hidden">
      {/* Background ambient gradients & Cursor Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Cursor Glow */}
        <div 
          className="absolute w-[600px] h-[600px] bg-cyan-400/[0.04] rounded-full blur-[100px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)` }}
        />
        
        {/* Floating Orbs */}
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-indigo-600/[0.05] rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-400/[0.04] rounded-full blur-[100px] animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-purple-500/[0.03] rounded-full blur-[100px] animate-float [animation-delay:4s]" />
        
        {/* CSS Particles Simulation */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <Navbar />

      <main className="pt-24 pb-16 px-6 md:px-12 max-w-[1400px] mx-auto z-10 relative space-y-12">
        {/* Hero + Interactive Section — side by side on desktop */}
        <section
          id="home"
          className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 min-h-[calc(100vh-160px)] scroll-mt-24"
          aria-label="Hero and AI Chat"
        >
          <AnimatedSection direction="left" className="w-full md:w-1/2 flex flex-col justify-center">
            <Hero />
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2} className="w-full md:w-1/2 flex flex-col items-center gap-6">
            
            <JobContextPanel 
              jobDescription={jobDescription} 
              setJobDescription={(jd) => {
                setJobDescription(jd);
                if (!jd) setShowReport(false);
              }}
              onGenerateReport={() => setShowReport(true)}
            />

            {showReport ? (
              <JobMatchBox jobDescription={jobDescription} onBack={() => setShowReport(false)} />
            ) : (
              <ChatBox jobDescription={jobDescription} />
            )}
            
            
          </AnimatedSection>
        </section>

        {/* Portfolio Sections */}
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <footer className="w-full py-10 border-t border-white/6 text-center text-xs font-mono text-gray-500 z-10 relative bg-surface-950">
        <div className="mb-4">Built with</div>
        <div className="flex justify-center gap-4 text-cyan-400/80 mb-6 flex-wrap">
          <span>React</span>
          <span>FastAPI</span>
          <span>Groq</span>
          <span>Tailwind CSS</span>
          <span>Vite</span>
        </div>
        <div>© {new Date().getFullYear()} Jyoti Ranjan Panda • All rights reserved</div>
      </footer>
    </div>
  );
}

export default App;
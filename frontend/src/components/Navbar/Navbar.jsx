import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Fixed top navbar with:
 * - Brand logo
 * - Navigation links for all portfolio sections
 * - Ask AI CTA button
 * - Mobile hamburger menu
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAskAiClick = (e) => {
    e.preventDefault();
    setIsMobileOpen(false);
    document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.querySelector('#chat-input')?.focus();
    }, 400);
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`
        fixed top-0 w-full z-50 transition-all duration-300
        ${isScrolled
          ? 'bg-surface-950/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-transparent'
        }
      `}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-4 w-full max-w-[1300px] mx-auto">
        {/* Logo */}
        <a
          className="font-sans text-xl font-extrabold tracking-tight text-white hover:text-cyan-400 transition-colors focus-ring"
          href="#"
          aria-label="Jyoti.AI — Home"
        >
          JYOTI<span className="text-cyan-400">.AI</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors focus-ring"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#home"
            onClick={handleAskAiClick}
            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-400/30 rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 text-white font-mono text-xs uppercase tracking-widest active:scale-95 focus-ring shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          >
            Ask AI ✨
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus-ring"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
        >
          <motion.span
            animate={isMobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-[2px] bg-white"
          />
          <motion.span
            animate={isMobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-[2px] bg-white"
          />
          <motion.span
            animate={isMobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block w-5 h-[2px] bg-white"
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-surface-950/95 backdrop-blur-2xl border-t border-white/8 px-6 py-6 flex flex-col gap-4"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className="text-base text-gray-300 hover:text-white transition-colors py-2 focus-ring"
              >
                {label}
              </a>
            ))}
            <a
              href="#home"
              onClick={handleAskAiClick}
              className="mt-2 text-center py-3 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-white font-mono text-xs uppercase tracking-widest hover:border-cyan-400 transition-colors focus-ring"
            >
              Ask AI ✨
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

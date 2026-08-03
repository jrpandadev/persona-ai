import { motion } from 'framer-motion';

/**
 * Hero section with:
 * - Animated avatar with float + glow effects
 * - Staggered text entrance (name → title → bio → buttons)
 * - Accessible links with proper ARIA labels
 */
export function Hero() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full flex flex-col justify-center items-start py-8 md:py-12"
      aria-label="Introduction"
    >
      {/* Avatar */}
      <motion.div variants={fadeUp} className="mb-8 relative group">
        <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] rounded-full relative flex items-center justify-center">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-2xl animate-glow-pulse -z-10" />
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-pulse" />

          {/* Avatar face */}
          <div
            className="
              w-full h-full rounded-full overflow-hidden
              border-2 border-cyan-400/25 shadow-[0_0_50px_rgba(6,182,212,0.15)]
              bg-surface-900
              animate-float
              group-hover:scale-105 transition-transform duration-500
            "
          >
            <img
              src="/avatar.png"
              alt="Jyoti Ranjan Panda"
              className="w-full h-full object-cover"
              style={{ objectPosition: '22% 15%' }}
            />
          </div>

          {/* Online dot */}
          <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-surface-950">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1
        variants={fadeUp}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 leading-[1.1] tracking-tight"
      >
        Jyoti Ranjan
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
          Panda
        </span>
      </motion.h1>

      {/* Title */}
      <motion.h2
        variants={fadeUp}
        className="text-lg md:text-xl text-cyan-400/90 mb-5 flex items-center gap-2 font-semibold"
      >
        <span className="font-mono text-cyan-400/60">&gt;_</span>
        AI Engineer | Mathematics &amp; Computing
      </motion.h2>

      {/* Bio */}
      <motion.p
        variants={fadeUp}
        className="text-sm md:text-base text-gray-400 mb-8 max-w-lg leading-relaxed"
      >
        Building AI-powered applications with Python, FastAPI, React, and LLMs.
        Dedicated to engineering precision and creating intelligent systems.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        <a
          href="https://github.com/jrpandadev"
          target="_blank"
          rel="noreferrer"
          aria-label="View Jyoti's GitHub profile"
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-gradient-to-r from-indigo-600 to-indigo-500
            text-white font-mono text-xs uppercase tracking-widest rounded-lg
            shadow-lg shadow-indigo-600/20
            hover:shadow-indigo-600/40 hover:brightness-110
            active:scale-95 transition-all duration-300 focus-ring
          "
        >
          View GitHub
        </a>
        <a
          href="#chat"
          aria-label="Start a conversation with the AI assistant"
          className="
            inline-flex items-center gap-2 px-6 py-3
            bg-transparent border border-white/10 text-white
            font-mono text-xs uppercase tracking-widest rounded-lg
            hover:border-cyan-400/40 hover:bg-cyan-400/5
            active:scale-95 transition-all duration-300 focus-ring
          "
        >
          Chat with AI
        </a>
      </motion.div>
    </motion.section>
  );
}

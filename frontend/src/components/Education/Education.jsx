import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { SectionHeading } from '../UI/SectionHeading';

const EDUCATION_ITEMS = [
  {
    institution: 'Odisha University of Technology and Research (OUTR)',
    degree: 'Integrated M.Sc.',
    field: 'Mathematics and Computing',
    period: '2025 — 2030',
    cgpa: '8.4 / 10',
    description:
      'Rigorous curriculum focusing on advanced computational mathematics, data structures, algorithms, statistics, machine learning fundamentals, and software development.',
    highlights: [
      'Advanced Calculus & Linear Algebra',
      'Data Structures & Algorithms',
      'Discrete Mathematics & Optimization',
      'Applied Statistics & Machine Learning',
    ],
  },
];

/**
 * Education & Academic Timeline Section.
 */
export function Education() {
  return (
    <section id="education" className="w-full py-16 md:py-20 scroll-mt-28">
      <SectionHeading
        label="Academic Background"
        title="Education"
        subtitle="Formal academic training combining mathematical foundations with computer science."
      />

      <div className="max-w-3xl mx-auto relative pl-6 md:pl-8 border-l border-cyan-400/20 space-y-12">
        {EDUCATION_ITEMS.map((edu, idx) => (
          <motion.div
            key={edu.institution}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline node dot */}
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-cyan-400 border-4 border-surface-950 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

            <GlassCard className="p-6 md:p-8 hover:border-cyan-400/30 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-cyan-400 font-mono">
                    {edu.degree} in {edu.field}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono text-xs text-gray-300">
                    📅 {edu.period}
                  </span>
                  <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full font-mono text-xs text-cyan-300 font-bold">
                    CGPA: {edu.cgpa}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                {edu.description}
              </p>

              <div>
                <h4 className="text-xs font-mono uppercase text-gray-500 tracking-wider mb-2">
                  Key Focus Areas:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {edu.highlights.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs rounded-md bg-surface-900 border border-white/5 text-gray-300 font-sans"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

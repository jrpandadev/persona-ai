import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { SectionHeading } from '../UI/SectionHeading';

const CONTACT_METHODS = [
  {
    name: 'GitHub',
    icon: '🐙',
    label: '@jrpandadev',
    href: 'https://github.com/jrpandadev',
    description: 'Explore my open source AI repositories and projects.',
  },
  {
    name: 'Email',
    icon: '✉️',
    label: 'jrpanda.dev@gmail.com',
    href: 'mailto:jrpanda.dev@gmail.com',
    description: 'Get in touch directly for opportunities or collaborations.',
  },
  {
    name: 'LinkedIn',
    icon: '💼',
    label: 'Jyoti Ranjan Panda',
    href: 'https://www.linkedin.com/in/jrpandadev',
    description: 'Connect professionally and stay updated on my journey.',
  },
];

/**
 * Contact & Reach Out Section.
 */
export function Contact() {
  return (
    <section id="contact" className="w-full py-16 md:py-20 scroll-mt-28">
      <SectionHeading
        label="Get in Touch"
        title="Let's Connect"
        subtitle="Open for AI engineering roles, internships, and collaborative research projects."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {CONTACT_METHODS.map((method, idx) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-cyan-400/40 hover:scale-[1.02] transition-all duration-300 group">
              <div>
                <div className="text-3xl mb-3">{method.icon}</div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                  {method.name}
                </h3>
                <p className="text-xs text-cyan-400 font-mono mb-3">
                  {method.label}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  {method.description}
                </p>
              </div>

              <a
                href={method.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-white group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10 transition-all duration-300"
              >
                Connect on {method.name} →
              </a>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

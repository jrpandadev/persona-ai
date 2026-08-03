import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { SkillBadge } from '../UI/SkillBadge';
import { SectionHeading } from '../UI/SectionHeading';

const PROJECTS = [
  {
    name: 'CareerLens AI',
    tagline: 'AI Resume Analyzer & Job Matcher',
    description:
      'An AI-powered resume analysis and job matching platform that evaluates resumes against job descriptions, identifies skill gaps, and provides actionable feedback.',
    techStack: ['Python', 'Groq API', 'Pydantic', 'Resume Matching'],
    github: 'https://github.com/jrpandadev/career-lens-ai',
  },
  {
    name: 'AI Portfolio',
    tagline: 'Interactive AI Recruiter Chat',
    description:
      'An AI-powered portfolio where recruiters can chat with an interactive AI version of the candidate. Features streaming responses, prompt engineering, and background matching.',
    techStack: ['Python', 'FastAPI', 'Groq API', 'React', 'Streaming'],
    github: 'https://github.com/jrpandadev/persona-ai',
  },
  {
    name: 'AEGIS',
    tagline: 'AI Safety Platform',
    description:
      'An AI Safety Platform incorporating real-time geospatial mapping, LLM-driven safety assessment, and high-performance backend infrastructure.',
    techStack: ['FastAPI', 'Supabase', 'Mistral AI', 'Google Maps Platform'],
    github: '',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

/**
 * Projects section with glass cards, shared SkillBadge, and entrance animations.
 */
export function Projects() {
  return (
    <section id="projects" className="w-full py-16 md:py-20 scroll-mt-28">
      <SectionHeading
        label="Featured Work"
        title="Projects"
        subtitle="Real-world AI systems and applications built with cutting-edge technologies."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROJECTS.map((proj, idx) => (
          <motion.div
            key={proj.name}
            custom={idx}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="h-full"
          >
            <GlassCard className="p-6 h-full flex flex-col justify-between hover:scale-[1.02] hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 group">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {proj.name}
                  </h3>
                </div>
                <p className="text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                  {proj.tagline}
                </p>
                <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {proj.techStack.map((tech) => (
                    <SkillBadge key={tech} name={tech} variant="cyan" />
                  ))}
                </div>
              </div>

              <div>
                {proj.github ? (
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${proj.name} on GitHub`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors focus-ring"
                  >
                    View Repository
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <span className="text-xs font-mono text-gray-500 italic">
                    Internal System
                  </span>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

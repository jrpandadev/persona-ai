import { motion } from 'framer-motion';
import { GlassCard } from '../UI/GlassCard';
import { SkillBadge } from '../UI/SkillBadge';
import { SectionHeading } from '../UI/SectionHeading';

const SKILL_CATEGORIES = [
  {
    title: 'Languages',
    icon: '💻',
    skills: ['Python', 'C', 'JavaScript'],
  },
  {
    title: 'Backend Engineering',
    icon: '⚙️',
    skills: ['FastAPI', 'REST API Development', 'Pydantic', 'Structured Output'],
  },
  {
    title: 'AI & Machine Learning',
    icon: '🤖',
    skills: ['LLM Integration', 'Prompt Engineering', 'Groq API', 'Mistral AI', 'Streaming Responses'],
  },
  {
    title: 'Frontend Development',
    icon: '🎨',
    skills: ['React', 'HTML5', 'CSS3', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Databases & Cloud',
    icon: '🗄️',
    skills: ['Supabase', 'PostgreSQL', 'Google Maps Platform'],
  },
  {
    title: 'Tools & Workflow',
    icon: '🛠️',
    skills: ['Git', 'GitHub', 'VS Code', 'uv', 'Vite'],
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * Categorized Skills Section.
 */
export function Skills() {
  return (
    <section id="skills" className="w-full py-16 md:py-20 scroll-mt-28">
      <SectionHeading
        label="Technical Expertise"
        title="Skills & Technologies"
        subtitle="A comprehensive overview of my technical stack across AI engineering, backend, and web technologies."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {SKILL_CATEGORIES.map((category) => (
          <motion.div key={category.title} variants={itemVariants}>
            <GlassCard className="p-6 h-full hover:border-cyan-400/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">{category.icon}</span>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  {category.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill} name={skill} variant="indigo" />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

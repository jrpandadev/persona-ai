import React from 'react';

const projects = [
  {
    name: 'AI Portfolio',
    description: 'An AI-powered portfolio where recruiters can chat with an AI version of the candidate.',
    techStack: ['Python', 'FastAPI', 'Groq API', 'React'],
    highlights: ['LLM Integration', 'Streaming Responses', 'Prompt Engineering', 'Job Description Matching'],
    github: 'https://github.com/jrpandadev/persona-ai'
  },
  {
    name: 'CareerLens AI',
    description: 'An AI-powered resume analysis and job matching platform that evaluates resumes against job descriptions.',
    techStack: ['Python', 'FastAPI', 'Groq API', 'Pydantic'],
    highlights: ['Resume parsing', 'AI-powered resume scoring', 'Job description matching', 'Skill gap analysis'],
    github: 'https://github.com/jrpandadev/career-lens-ai'
  }
];

export function Projects() {
  return (
    <section id="projects" className="w-full py-16">
      <h2 className="text-3xl font-bold text-white mb-8">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((proj, idx) => (
          <div key={idx} className="bg-neutral-900/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-400/40 transition-colors">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{proj.name}</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">{proj.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {proj.techStack.map((tech, tIdx) => (
                  <span key={tIdx} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-mono rounded-md border border-indigo-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {proj.github && (
              <a
                href={proj.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline mt-2"
              >
                View Repository ➔
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

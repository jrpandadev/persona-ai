/**
 * Pill-shaped tech badge for skills and project tech stacks.
 * Consistent styling across Skills section and Project cards.
 *
 * @param {'cyan' | 'indigo'} variant - Color variant for different contexts.
 */
export function SkillBadge({ name, variant = 'cyan' }) {
  const variants = {
    cyan: 'bg-cyan-400/5 text-cyan-300 border-cyan-400/20 hover:border-cyan-400/40',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:border-indigo-500/40',
  };

  return (
    <span
      className={`
        inline-block px-3.5 py-1.5 rounded-full font-mono text-xs
        border transition-colors duration-200
        ${variants[variant]}
      `}
    >
      {name}
    </span>
  );
}

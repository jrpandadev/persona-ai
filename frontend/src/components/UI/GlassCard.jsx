/**
 * Glassmorphism card with consistent styling.
 * Supports hover border glow and lift effect.
 */
export function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        glass-panel rounded-2xl
        ${hover ? 'glass-panel-hover hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

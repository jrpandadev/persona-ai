import { motion } from 'framer-motion';

/**
 * Wrapper for scroll-triggered fade-in / slide-up entrance animation.
 * Apply to any major section for consistent entrance effects.
 *
 * @param {'up' | 'left' | 'right'} direction - Slide direction.
 * @param {number} delay - Animation delay in seconds.
 */
export function AnimatedSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  ...props
}) {
  const offsets = {
    up: { x: 0, y: 40 },
    left: { x: -40, y: 0 },
    right: { x: 40, y: 0 },
  };

  const { x, y } = offsets[direction];

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

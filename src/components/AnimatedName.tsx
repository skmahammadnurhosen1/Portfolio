import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AnimatedNameProps {
  className?: string;
  dotClassName?: string;
  showDot?: boolean;
  intervalMs?: number;
}

/**
 * AnimatedName Component
 * - Fixed, rock-solid "NO" prefix
 * - Ultra-smooth kinetic slot-wheel transform for letters 3 & 4 ('OR' <-> 'RA')
 * - Staggered mechanical cadence with spring damping and zero clipping
 * - Radiant amber pulse & expanding wave ring on the signature dot
 * - Interactive click & hover to trigger instant transition
 */
export function AnimatedName({
  className = '',
  dotClassName = 'w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full bg-amber-400 ml-1 translate-y-[-2px]',
  showDot = true,
  intervalMs = 3200,
}: AnimatedNameProps) {
  const [isNora, setIsNora] = useState(false);
  const [bounceCount, setBounceCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsNora((prev) => !prev);
      setBounceCount((c) => c + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  // Current suffix letters
  const char3 = isNora ? 'R' : 'O';
  const char4 = isNora ? 'A' : 'R';

  // Interactive toggle
  const handleToggle = () => {
    setIsNora((prev) => !prev);
    setBounceCount((c) => c + 1);
  };

  return (
    <span
      onClick={handleToggle}
      title="Click to toggle NOOR / NORA"
      className={`inline-flex items-baseline select-none cursor-pointer group/animated-name ${className}`}
    >
      {/* 1. Anchored Static Letters: "NO" */}
      <span className="shrink-0 tracking-tight transition-transform duration-200 group-hover/animated-name:scale-[1.02]">
        NO
      </span>

      {/* 2. Kinetic Suffix Letters ('OR' <-> 'RA') */}
      <span className="inline-flex items-baseline relative ml-[1px]">
        {/* Letter 3 ('O' <-> 'R') */}
        <span className="relative inline-flex items-baseline justify-center min-w-[0.62em] h-full overflow-hidden align-baseline">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`char3-${char3}`}
              initial={{
                y: isNora ? '75%' : '-75%',
                opacity: 0,
                scale: 0.88,
                filter: 'blur(2px)',
              }}
              animate={{
                y: '0%',
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                y: isNora ? '-75%' : '75%',
                opacity: 0,
                scale: 0.88,
                filter: 'blur(2px)',
              }}
              transition={{
                duration: 0.46,
                ease: [0.22, 1.25, 0.36, 1], // Crisp spring bounce
              }}
              className="inline-block leading-none transform-gpu font-inherit"
            >
              {char3}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* Letter 4 ('R' <-> 'A') - With precise 65ms stagger */}
        <span className="relative inline-flex items-baseline justify-center min-w-[0.65em] h-full overflow-hidden align-baseline">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`char4-${char4}`}
              initial={{
                y: isNora ? '75%' : '-75%',
                opacity: 0,
                scale: 0.88,
                filter: 'blur(2px)',
              }}
              animate={{
                y: '0%',
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                y: isNora ? '-75%' : '75%',
                opacity: 0,
                scale: 0.88,
                filter: 'blur(2px)',
              }}
              transition={{
                duration: 0.46,
                delay: 0.065, // Staggered mechanical delivery
                ease: [0.22, 1.25, 0.36, 1],
              }}
              className="inline-block leading-none transform-gpu font-inherit"
            >
              {char4}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* Shimmer light sweep that accents the name on transformation */}
        <motion.span
          key={`shimmer-${bounceCount}`}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: '180%', opacity: [0, 0.65, 0] }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeInOut' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none skew-x-[-20deg]"
        />
      </span>

      {/* 3. Trademark Amber Dot with Radiant Pulse & Ripple Ring */}
      {showDot && (
        <span className="relative inline-flex items-center justify-center">
          {/* Expanding golden ripple wave */}
          <motion.span
            key={`wave-${bounceCount}`}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
            className={`absolute rounded-full bg-amber-400/50 pointer-events-none ${dotClassName}`}
          />
          {/* Main Dot */}
          <motion.span
            key={`dot-${bounceCount}`}
            animate={{
              scale: [1, 1.4, 0.92, 1.12, 1],
              y: [0, -3, 1, -1, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: 'easeOut',
            }}
            className={`inline-block shadow-[0_0_12px_rgba(245,158,11,0.5)] ${dotClassName}`}
          />
        </span>
      )}
    </span>
  );
}

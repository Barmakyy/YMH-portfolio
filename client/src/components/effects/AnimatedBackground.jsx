import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// Animated blob component with GSAP
const AnimatedBlob = ({ 
  color, 
  size, 
  position, 
  delay = 0,
  duration = 20
}) => {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    // Random movement animation
    const ctx = gsap.context(() => {
      gsap.to(blob, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.8, 1.2)',
        duration: duration,
        delay: delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => ctx.revert();
  }, [delay, duration]);

  return (
    <motion.div
      ref={blobRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay: delay }}
      className="absolute rounded-full blur-3xl"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        width: size,
        height: size,
        ...position,
      }}
    />
  );
};

// Floating particles with GSAP
const FloatingParticles = ({ count = 30 }) => {
  const containerRef = useRef(null);
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'rgba(241, 245, 20, 0.4)',
            boxShadow: '0 0 10px rgba(241, 245, 20, 0.3)',
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Grid animation
const AnimatedGrid = () => {
  return (
    <motion.div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(241, 245, 20, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(241, 245, 20, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
      animate={{
        backgroundPosition: ['0px 0px', '80px 80px'],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

// Noise overlay for texture
const NoiseOverlay = () => (
  <div 
    className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// Main animated background component
const AnimatedBackground = ({ variant = 'hero' }) => {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#050510] to-[#030303]" />
        
        {/* Animated grid */}
        <AnimatedGrid />
        
        {/* Gradient blobs */}
        <AnimatedBlob
          color="rgba(241, 245, 20, 0.12)"
          size="800px"
          position={{ top: '-20%', left: '-15%' }}
          delay={0}
          duration={25}
        />
        <AnimatedBlob
          color="rgba(139, 92, 246, 0.08)"
          size="700px"
          position={{ bottom: '-10%', right: '-10%' }}
          delay={2}
          duration={30}
        />
        <AnimatedBlob
          color="rgba(251, 191, 36, 0.06)"
          size="500px"
          position={{ top: '40%', right: '20%' }}
          delay={4}
          duration={22}
        />
        <AnimatedBlob
          color="rgba(59, 130, 246, 0.05)"
          size="400px"
          position={{ bottom: '30%', left: '10%' }}
          delay={6}
          duration={28}
        />
        
        {/* Floating particles */}
        <FloatingParticles count={25} />
        
        {/* Noise texture */}
        <NoiseOverlay />
        
        {/* Vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-secondary" />
      <NoiseOverlay />
    </div>
  );
};

export default AnimatedBackground;
export { AnimatedBlob, FloatingParticles, AnimatedGrid, NoiseOverlay };

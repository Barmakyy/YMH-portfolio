import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import gsap from 'gsap';
import { AnimatedBackground } from '../effects';

const roles = [
  'Full-Stack Developer',
  'React Developer',
  'Web Developer',
  'JavaScript Enthusiast',
];

// Elegant floating shape component with GSAP enhancement
const ElegantShape = ({
  className = '',
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}) => {
  const shapeRef = useRef(null);

  useEffect(() => {
    const shape = shapeRef.current;
    if (!shape) return;

    // GSAP breathing animation
    const ctx = gsap.context(() => {
      gsap.to(shape, {
        scale: 1.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay,
      });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <motion.div
      ref={shapeRef}
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={`
            absolute inset-0 rounded-full
            bg-gradient-to-r to-transparent
            ${gradient}
            backdrop-blur-[2px] border-2 border-white/[0.15]
            shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
            after:absolute after:inset-0 after:rounded-full
            after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]
          `}
        />
      </motion.div>
    </motion.div>
  );
};

// Magnetic cursor effect for the name
const MagneticText = ({ children, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
};

const Hero = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const heroRef = useRef(null);

  // GSAP entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the entire hero section
      gsap.from('.hero-content', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    const typeSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    if (!isDeleting && displayedText === currentRole) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }

    if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(
        isDeleting
          ? currentRole.substring(0, displayedText.length - 1)
          : currentRole.substring(0, displayedText.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Animated Background with particles and blobs */}
      <AnimatedBackground variant="hero" />

      {/* Floating Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-amber-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-yellow-400/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-400/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="hero-content inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/[0.1] mb-8 md:mb-12 shadow-[0_4px_20px_rgba(241,245,20,0.1)]"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(241,245,20,0.6)]" />
            <span className="text-sm text-white/70 tracking-widest uppercase font-medium">
              Available for Work
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="hero-content"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8 tracking-tighter leading-[0.9]">
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                style={{ textShadow: '0 4px 30px rgba(255,255,255,0.1)' }}
              >
                Hi, I'm
              </span>
              <br />
              <MagneticText className="cursor-pointer">
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 drop-shadow-[0_0_15px_rgba(241,245,20,0.15)]"
                  style={{ textShadow: '0 2px 20px rgba(241,245,20,0.1)' }}
                >
                  YAHYA MOHAMED
                </span>
              </MagneticText>
            </h1>
          </motion.div>

          {/* Typewriter Role */}
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="hero-content h-14 mb-8"
          >
            <span 
              className="inline-block px-6 py-2 text-xl sm:text-2xl lg:text-3xl text-white/80 font-display font-semibold tracking-wide backdrop-blur-sm bg-white/[0.02] rounded-lg border border-white/[0.05]"
              style={{ textShadow: '0 2px 20px rgba(255,255,255,0.1)' }}
            >
              {displayedText}
              <span className="animate-pulse text-accent drop-shadow-[0_0_10px_rgba(241,245,20,0.5)]">|</span>
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="hero-content"
          >
            <p 
              className="text-base sm:text-lg md:text-xl text-white/50 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
            >
              I build fast, scalable web applications from database to deployment.
              <br />
              <span className="text-white/70 font-normal">Turning complex problems into elegant, user-friendly solutions.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Top and bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-sm">Scroll Down</span>
          <FiArrowDown />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
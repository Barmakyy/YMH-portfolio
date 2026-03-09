import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Hero, 
  FeaturedProjects, 
  AboutTeaser, 
  SkillsSnapshot, 
  BlogPreview, 
  ContactCTA 
} from '../components/sections';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animated section wrapper component
const AnimatedSection = ({ children, className = '', animation = 'fadeUp' }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let fromProps = {};
    let toProps = { opacity: 1 };

    switch (animation) {
      case 'fadeUp':
        fromProps = { opacity: 0, y: 80 };
        toProps = { ...toProps, y: 0 };
        break;
      case 'fadeLeft':
        fromProps = { opacity: 0, x: -80 };
        toProps = { ...toProps, x: 0 };
        break;
      case 'fadeRight':
        fromProps = { opacity: 0, x: 80 };
        toProps = { ...toProps, x: 0 };
        break;
      case 'scale':
        fromProps = { opacity: 0, scale: 0.9 };
        toProps = { ...toProps, scale: 1 };
        break;
      default:
        fromProps = { opacity: 0 };
    }

    gsap.set(section, fromProps);

    const ctx = gsap.context(() => {
      gsap.to(section, {
        ...toProps,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [animation]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
};

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Refresh ScrollTrigger when all content is loaded
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={containerRef}>
      <Hero />
      
      <AnimatedSection animation="fadeUp">
        <FeaturedProjects />
      </AnimatedSection>
      
      <AnimatedSection animation="fadeUp">
        <AboutTeaser />
      </AnimatedSection>
      
      <AnimatedSection animation="fadeUp">
        <SkillsSnapshot />
      </AnimatedSection>
      
      <AnimatedSection animation="fadeUp">
        <BlogPreview />
      </AnimatedSection>
      
      <AnimatedSection animation="scale">
        <ContactCTA />
      </AnimatedSection>
    </div>
  );
};

export default Home;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom hook for scroll-triggered animations
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      animation = 'fadeUp',
      duration = 1,
      delay = 0,
      start = 'top 85%',
      end = 'bottom 20%',
      scrub = false,
      markers = false,
    } = options;

    let animationProps = {};

    switch (animation) {
      case 'fadeUp':
        gsap.set(element, { opacity: 0, y: 60 });
        animationProps = { opacity: 1, y: 0 };
        break;
      case 'fadeDown':
        gsap.set(element, { opacity: 0, y: -60 });
        animationProps = { opacity: 1, y: 0 };
        break;
      case 'fadeLeft':
        gsap.set(element, { opacity: 0, x: -60 });
        animationProps = { opacity: 1, x: 0 };
        break;
      case 'fadeRight':
        gsap.set(element, { opacity: 0, x: 60 });
        animationProps = { opacity: 1, x: 0 };
        break;
      case 'scale':
        gsap.set(element, { opacity: 0, scale: 0.8 });
        animationProps = { opacity: 1, scale: 1 };
        break;
      case 'rotate':
        gsap.set(element, { opacity: 0, rotation: -10 });
        animationProps = { opacity: 1, rotation: 0 };
        break;
      default:
        gsap.set(element, { opacity: 0 });
        animationProps = { opacity: 1 };
    }

    const ctx = gsap.context(() => {
      gsap.to(element, {
        ...animationProps,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          markers,
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
};

// Stagger animation for multiple children
export const useStaggerAnimation = (options = {}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const {
      childSelector = ':scope > *',
      stagger = 0.1,
      duration = 0.8,
      start = 'top 85%',
      animation = 'fadeUp',
    } = options;

    const children = container.querySelectorAll(childSelector);
    if (!children.length) return;

    let fromProps = {};
    let toProps = {};

    switch (animation) {
      case 'fadeUp':
        fromProps = { opacity: 0, y: 40 };
        toProps = { opacity: 1, y: 0 };
        break;
      case 'fadeLeft':
        fromProps = { opacity: 0, x: -40 };
        toProps = { opacity: 1, x: 0 };
        break;
      case 'scale':
        fromProps = { opacity: 0, scale: 0.9 };
        toProps = { opacity: 1, scale: 1 };
        break;
      default:
        fromProps = { opacity: 0 };
        toProps = { opacity: 1 };
    }

    gsap.set(children, fromProps);

    const ctx = gsap.context(() => {
      gsap.to(children, {
        ...toProps,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => ctx.revert();
  }, [options]);

  return containerRef;
};

// Parallax effect hook
export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        y: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
};

// Text reveal animation
export const useTextReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const { start = 'top 80%', duration = 1 } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          backgroundSize: '0% 100%',
        },
        {
          backgroundSize: '100% 100%',
          duration,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start,
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [options]);

  return ref;
};

export default {
  useScrollAnimation,
  useStaggerAnimation,
  useParallax,
  useTextReveal,
};

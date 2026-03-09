import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';

// Lazy load Spline to improve initial load time
const Spline = lazy(() => import('@splinetool/react-spline'));

// Loading placeholder
const SplineLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div
      className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

// Spline 3D Scene Component
const Spline3D = ({
  scene,
  className = '',
  onLoad,
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = (spline) => {
    setIsLoaded(true);
    if (onLoad) onLoad(spline);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      <Suspense fallback={<SplineLoader />}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <Spline
            scene={scene}
            onLoad={handleLoad}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>
      </Suspense>

      {/* Loading overlay */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute inset-0 bg-bg-primary"
        >
          <SplineLoader />
        </motion.div>
      )}
    </div>
  );
};

// Pre-configured Spline scenes for common use cases
// Users can add their own scene URLs from Spline.design

// Hero 3D background with abstract shapes
export const SplineHeroBackground = ({ className = '' }) => (
  <Spline3D
    // Default abstract scene - replace with your own Spline scene URL
    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
    className={`absolute inset-0 ${className}`}
    style={{ pointerEvents: 'none' }}
  />
);

// Interactive 3D object
export const SplineInteractive = ({ scene, className = '' }) => (
  <Spline3D
    scene={scene}
    className={className}
  />
);

export default Spline3D;

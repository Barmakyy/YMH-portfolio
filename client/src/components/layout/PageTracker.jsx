import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';

// Component to auto-track page views
export const PageTracker = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page view when location changes
    const pageTitle = document.title || 'Unknown Page';
    trackPageView(location.pathname, pageTitle);
  }, [location, trackPageView]);

  return null; // This component doesn't render anything
};

export default PageTracker;

import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate or retrieve a session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const sessionIdRef = useRef(getSessionId());
  const pageStartTimeRef = useRef(Date.now());

  // Track project view (memoized to prevent infinite loops)
  const trackProjectView = useCallback((projectSlug, projectTitle) => {
    try {
      axios.post(`${API_URL}/analytics/track`, {
        eventType: 'project_view',
        page: `/projects/${projectSlug}`,
        title: projectTitle,
        referrer: document.referrer || '',
        sessionId: sessionIdRef.current,
      }).catch(err => console.warn('Analytics tracking failed:', err.message));
    } catch (error) {
      console.warn('Failed to track project view:', error);
    }
  }, []);

  // Track blog view (memoized)
  const trackBlogView = useCallback((blogSlug, blogTitle) => {
    try {
      axios.post(`${API_URL}/analytics/track`, {
        eventType: 'blog_view',
        page: `/blog/${blogSlug}`,
        title: blogTitle,
        referrer: document.referrer || '',
        sessionId: sessionIdRef.current,
      }).catch(err => console.warn('Analytics tracking failed:', err.message));
    } catch (error) {
      console.warn('Failed to track blog view:', error);
    }
  }, []);

  // Track link clicks (memoized)
  const trackLinkClick = useCallback((linkType, url) => {
    try {
      axios.post(`${API_URL}/analytics/track`, {
        eventType: 'link_click',
        page: window.location.pathname,
        title: `${linkType} link clicked`,
        sessionId: sessionIdRef.current,
        metadata: { linkType, url },
      }).catch(err => console.warn('Analytics tracking failed:', err.message));
    } catch (error) {
      console.warn('Failed to track link click:', error);
    }
  }, []);

  // Track resume/CV downloads (memoized)
  const trackDownload = useCallback((fileType) => {
    try {
      axios.post(`${API_URL}/analytics/track`, {
        eventType: 'download',
        page: window.location.pathname,
        title: `${fileType} downloaded`,
        sessionId: sessionIdRef.current,
        metadata: { fileType },
      }).catch(err => console.warn('Analytics tracking failed:', err.message));
    } catch (error) {
      console.warn('Failed to track download:', error);
    }
  }, []);

  return {
    trackProjectView,
    trackBlogView,
    trackLinkClick,
    trackDownload,
    sessionId: sessionIdRef.current,
  };
};

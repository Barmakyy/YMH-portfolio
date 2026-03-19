import Analytics from '../models/Analytics.js';
import crypto from 'crypto';

// Anonymize IP address by hashing
const hashIP = (ip) => {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
};

// POST /api/analytics/track
export const trackEvent = async (req, res, next) => {
  try {
    const { eventType, page, title, referrer, viewTime, sessionId, metadata } = req.body;

    if (!eventType || !page) {
      return res.status(400).json({ message: 'eventType and page are required.' });
    }

    // Get client IP (handle proxies)
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
    const ipHash = hashIP(ip);

    const analytics = await Analytics.create({
      eventType,
      page,
      title: title || 'Unknown',
      referrer: referrer || '',
      viewTime: viewTime || 0,
      userAgent: req.headers['user-agent'],
      ipHash,
      sessionId,
      metadata,
    });

    res.status(201).json({ status: 'success', data: analytics });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/summary
export const getAnalyticsSummary = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Total events (all types)
    const totalEvents = await Analytics.countDocuments({ createdAt: { $gte: startDate } });

    // Count by event type
    const eventCounts = await Analytics.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);

    // Unique sessions
    const uniqueSessions = await Analytics.distinct('sessionId', { createdAt: { $gte: startDate } });

    // Top pages (all event types)
    const topPages = await Analytics.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$page', views: { $sum: 1 }, title: { $first: '$title' } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    // Avg time on page
    const avgTime = await Analytics.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: null, avgViewTime: { $avg: '$viewTime' } } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalEvents,
        eventCounts,
        uniqueVisitors: uniqueSessions.length,
        topPages,
        avgTimeOnSite: Math.round(avgTime[0]?.avgViewTime || 0),
        dateRange: {
          from: startDate.toISOString().split('T')[0],
          to: new Date().toISOString().split('T')[0],
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/events
export const getAnalyticsEvents = async (req, res, next) => {
  try {
    const { page, eventType, days = 30, limit = 100 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const filter = { createdAt: { $gte: startDate } };
    if (page) filter.page = page;
    if (eventType) filter.eventType = eventType;

    const events = await Analytics.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const total = await Analytics.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      results: events.length,
      total,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analytics/pages
export const getTopPages = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const pages = await Analytics.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$page',
          title: { $first: '$title' },
          views: { $sum: 1 },
          avgTime: { $avg: '$viewTime' },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 20 },
    ]);

    res.status(200).json({ status: 'success', data: pages });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/analytics/all (admin only)
export const deleteAllAnalytics = async (req, res, next) => {
  try {
    await Analytics.deleteMany({});
    res.status(200).json({ status: 'success', message: 'All analytics data deleted.' });
  } catch (error) {
    next(error);
  }
};

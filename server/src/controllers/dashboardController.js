import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';
import Message from '../models/Message.js';
import Media from '../models/Media.js';
import Settings from '../models/Settings.js';

// GET /api/admin/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const [
      publishedProjects,
      publishedPosts,
      unreadMessages,
      totalMedia,
      recentMessages,
      recentPosts,
      recentProjects,
      featuredProject,
      settings,
    ] = await Promise.all([
      Project.countDocuments({ status: 'published' }),
      BlogPost.countDocuments({ status: 'published' }),
      Message.countDocuments({ status: 'new' }),
      Media.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5).select('name subject status createdAt'),
      BlogPost.find().sort({ createdAt: -1 }).limit(5).select('title status publishDate createdAt'),
      Project.find().sort({ updatedAt: -1 }).limit(5).select('title status updatedAt'),
      Project.findOne({ status: 'published' }).sort({ views: -1 }).select('title views'),
      Settings.findOne(),
    ]);

    // Build activity feed
    const activities = [
      ...recentMessages.map((m) => ({
        type: 'message',
        title: `New message from ${m.name}`,
        subtitle: m.subject || 'No subject',
        timestamp: m.createdAt,
        link: `/admin/messages/${m._id}`,
      })),
      ...recentPosts.map((p) => ({
        type: 'blog',
        title: `Blog post: ${p.title}`,
        subtitle: p.status,
        timestamp: p.createdAt,
        link: `/admin/blog/${p._id}/edit`,
      })),
      ...recentProjects.map((p) => ({
        type: 'project',
        title: `Project updated: ${p.title}`,
        subtitle: p.status,
        timestamp: p.updatedAt,
        link: `/admin/projects/${p._id}/edit`,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    // Content health checklist
    const healthChecks = [
      {
        label: 'Profile photo uploaded',
        passed: !!(settings?.profilePhoto),
        link: '/admin/settings',
      },
      {
        label: 'Resume uploaded',
        passed: !!(settings?.resumeUrl),
        link: '/admin/settings',
      },
      {
        label: 'At least one featured project',
        passed: await Project.exists({ featured: true, status: 'published' }),
        link: '/admin/projects',
      },
      {
        label: 'At least one published blog post',
        passed: publishedPosts > 0,
        link: '/admin/blog',
      },
    ];

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          publishedProjects,
          publishedPosts,
          unreadMessages,
          totalMedia,
          mostViewedProject: featuredProject
            ? { title: featuredProject.title, views: featuredProject.views }
            : null,
        },
        activities,
        healthChecks,
      },
    });
  } catch (error) {
    next(error);
  }
};

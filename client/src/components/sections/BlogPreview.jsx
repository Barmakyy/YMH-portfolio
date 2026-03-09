import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { Card, Badge } from '../ui';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BlogPreview = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/blog/public`)
      .then(({ data }) => setRecentPosts((data.data || []).slice(0, 3)))
      .catch(err => console.error('Failed to fetch posts:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-bg-secondary">
        <div className="container-custom flex justify-center">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (recentPosts.length === 0) return null;

  return (
    <section className="py-24 bg-bg-secondary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Latest Articles</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Technical deep-dives, tutorials, and thoughts on web development
          </p>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags || []).slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="accent" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 hover:text-accent transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary text-sm flex-grow mb-4">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-text-muted pt-4 border-t border-border">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    {formatDate(post.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={14} />
                    {post.readTime} min read
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            Read All Articles
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;

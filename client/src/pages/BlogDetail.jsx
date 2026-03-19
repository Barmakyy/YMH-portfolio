import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiClock, FiEye, FiTag } from 'react-icons/fi';
import { Badge, Button } from '../components/ui';
import axios from 'axios';
import { useAnalytics } from '../hooks/useAnalytics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { trackBlogView } = useAnalytics();

  useEffect(() => {
    axios.get(`${API_URL}/blog/public/${slug}`)
      .then(({ data }) => {
        setPost(data.data);
        trackBlogView(slug, data.data.title);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]); // Only depend on slug, trackBlogView is stable

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-text-secondary mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24">
      <div className="container-custom max-w-4xl">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
          >
            <FiArrowLeft />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="accent" size="sm">
                  <FiTag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-text-secondary mb-6">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted border-b border-border pb-6">
            {post.publishDate && (
              <span className="flex items-center gap-1.5">
                <FiCalendar size={14} />
                {formatDate(post.publishDate)}
              </span>
            )}
            {post.readTime > 0 && (
              <span className="flex items-center gap-1.5">
                <FiClock size={14} />
                {post.readTime} min read
              </span>
            )}
            {post.views > 0 && (
              <span className="flex items-center gap-1.5">
                <FiEye size={14} />
                {post.views} views
              </span>
            )}
          </div>
        </motion.header>

        {/* Cover Image */}
        {post.coverImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10 rounded-2xl overflow-hidden"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full max-h-[400px] object-contain mx-auto"
            />
          </motion.div>
        )}

        {/* Body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-text-primary
            prose-p:text-text-secondary prose-p:leading-relaxed
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-lg
            prose-code:bg-bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-bg-secondary prose-pre:border prose-pre:border-border
            prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;

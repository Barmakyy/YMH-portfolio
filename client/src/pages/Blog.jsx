import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiClock, FiCalendar, FiArrowRight, FiBookOpen, FiFileText, FiTag } from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlinePencilAlt } from 'react-icons/hi';
import { Card, Badge, Input } from '../components/ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, tagsRes] = await Promise.all([
          axios.get(`${API_URL}/blog/public`),
          axios.get(`${API_URL}/blog/public/tags`),
        ]);
        setPosts(postsRes.data.data || []);
        setAllTags(tagsRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch blog data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalReadTime = posts.reduce((sum, p) => sum + (p.readTime || 0), 0);
  const totalWords = posts.reduce((sum, p) => sum + (p.wordCount || 0), 0);

  const blogStats = [
    { icon: FiFileText, label: 'Articles', value: `${posts.length}` },
    { icon: FiBookOpen, label: 'Read Time', value: `${totalReadTime}+ min` },
    { icon: FiTag, label: 'Topics', value: `${allTags.length}` },
    { icon: HiOutlinePencilAlt, label: 'Words', value: totalWords >= 1000 ? `${(totalWords / 1000).toFixed(1)}K` : `${totalWords}` },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (post.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || selectedTag || searchQuery);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative flex items-center justify-center overflow-hidden">
        <img 
          src="https://i.pinimg.com/1200x/ef/c8/78/efc87887230039968639d32aead40c17.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-fill"
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />

        <div className="container-custom relative z-10 text-center py-24">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/30 rounded-full text-accent text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <HiOutlineSparkles className="w-4 h-4" />
              My Writings
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Blog & <span className="text-accent">Articles</span>
            </h1>
            
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              Technical deep-dives, MERN tutorials, and things I've learned along the way
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {blogStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                >
                  <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white drop-shadow-sm">{stat.value}</div>
                  <div className="text-xs text-gray-200">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && !selectedTag && !searchQuery && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <Link to={`/blog/${featuredPost.slug}`}>
                  <Card className="overflow-hidden group" padding={false}>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="aspect-video md:aspect-auto overflow-hidden">
                        <img
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <Badge variant="accent" size="sm" className="w-fit mb-3">
                          Featured
                        </Badge>
                        <h2 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-text-secondary mb-4 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(featuredPost.tags || []).slice(0, 3).map((tag) => (
                            <Badge key={tag} size="sm">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            {formatDate(featuredPost.publishDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock size={14} />
                            {featuredPost.readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.section>
            )}

            {/* Posts List */}
            <div className="space-y-6">
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <Card className="flex flex-col sm:flex-row gap-6 group" hover>
                      {/* Thumbnail */}
                      <div className="sm:w-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(post.tags || []).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="accent" size="sm">{tag}</Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            {formatDate(post.publishDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock size={14} />
                            {post.readTime} min
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-2">No articles found</h3>
                <p className="text-text-secondary">
                  Try adjusting your search or filter
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Search */}
              <div>
                <h3 className="font-bold mb-4">Search</h3>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-bold mb-4">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`
                      px-3 py-1.5 text-sm rounded-full transition-all
                      ${!selectedTag
                        ? 'bg-accent text-accent-contrast font-bold'
                        : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
                      }
                    `}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`
                        px-3 py-1.5 text-sm rounded-full transition-all
                        ${selectedTag === tag
                          ? 'bg-accent text-accent-contrast font-bold'
                          : 'bg-bg-secondary text-text-secondary hover:text-text-primary border border-border'
                        }
                      `}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                  <HiOutlinePencilAlt className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Stay Updated</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Get notified when I publish new articles
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-accent text-accent-contrast text-sm font-semibold rounded-full shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 hover:brightness-110 transition-all duration-300 hover:scale-[1.02]"
                >
                  Subscribe <FiArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </div>
          </aside>
        </div>
        )}
      </div>
    </div>
  );
};

export default Blog;

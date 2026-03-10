import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { FiMail, FiMapPin, FiClock, FiGithub, FiLinkedin, FiTwitter, FiSend, FiCheck, FiMessageSquare, FiUser, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { HiOutlineSparkles, HiOutlineLightningBolt } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Button, Input, Textarea, Select, Badge, Card } from '../components/ui';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Please select a subject'),
  budget: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  source: z.string().optional(),
  honeypot: z.string().max(0), // Spam protection
});

const subjectOptions = [
  { value: 'job', label: 'Job Opportunity' },
  { value: 'freelance', label: 'Freelance Project' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'other', label: 'Other' },
];

const budgetOptions = [
  { value: '<1000', label: '< $1,000' },
  { value: '1000-5000', label: '$1,000 – $5,000' },
  { value: '5000-15000', label: '$5,000 – $15,000' },
  { value: '15000+', label: '$15,000+' },
];

const sourceOptions = [
  { value: 'google', label: 'Google Search' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
];

const socialLinks = [
  { name: 'GitHub', icon: FiGithub, href: import.meta.env.VITE_GITHUB_URL, username: 'Barmakyy' },
  { name: 'LinkedIn', icon: FiLinkedin, href: import.meta.env.VITE_LINKEDIN_URL, username: import.meta.env.VITE_SITE_NAME },
  { name: 'Twitter', icon: FiTwitter, href: import.meta.env.VITE_TWITTER_URL, username: '@barmakyy' },
  { name: 'WhatsApp', icon: FaWhatsapp, href: import.meta.env.VITE_WHATSAPP_URL, username: 'Chat with me' },
  { name: 'Instagram', icon: FaInstagram, href: import.meta.env.VITE_INSTAGRAM_URL, username: '@barmakyy' },
];

const contactStats = [
  { icon: FiMessageSquare, label: 'Response Time', value: '<24h' },
  { icon: FiUser, label: 'Happy Clients', value: '10+' },
  { icon: FiMail, label: 'Emails', value: '50+' },
  { icon: HiOutlineLightningBolt, label: 'Projects', value: '8+' },
];

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      budget: '',
      message: '',
      source: '',
      honeypot: '',
    },
  });

  const selectedSubject = watch('subject');

  const onSubmit = async (data) => {
    // Check honeypot
    if (data.honeypot) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await axios.post(`${API_URL}/messages`, data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative flex items-center justify-center overflow-hidden">
        <img 
          src="https://i.pinimg.com/1200x/fc/c8/b2/fcc8b28af371bf355a5056cf5ab922d4.jpg"
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
              Get in Touch
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Let's Work <span className="text-accent">Together</span>
            </h1>
            
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              I'm currently available for freelance projects and full-time remote roles.
              I typically respond within 24 hours.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {contactStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card>
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="text-green-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-text-secondary mb-6">
                    Thanks for reaching out. I'll get back to you soon!
                  </p>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link to="/projects">
                      <Button variant="outline" className="px-8">
                        View My Projects
                        <FiArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {submitError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                      {submitError}
                    </div>
                  )}
                  {/* Honeypot - hidden from real users */}
                  <input
                    type="text"
                    {...register('honeypot')}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Full Name *"
                      placeholder="Your Name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="youremail@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Select
                      label="Subject *"
                      options={subjectOptions}
                      error={errors.subject?.message}
                      {...register('subject')}
                    />
                    
                    {selectedSubject === 'freelance' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <Select
                          label="Budget Range"
                          options={budgetOptions}
                          {...register('budget')}
                        />
                      </motion.div>
                    )}
                  </div>

                  <Textarea
                    label="Message *"
                    placeholder="Tell me about your project or opportunity..."
                    rows={6}
                    maxLength={2000}
                    showCount
                    error={errors.message?.message}
                    {...register('message')}
                  />

                  <Select
                    label="How did you find me?"
                    options={sourceOptions}
                    {...register('source')}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full py-4 text-base tracking-wide"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="inline-block"
                        >
                          ⏳
                        </motion.span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Availability Status */}
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500 font-medium text-sm">Available for Work</span>
              </div>
              <h3 className="font-bold mb-2">Open to Opportunities</h3>
              <p className="text-text-secondary text-sm">
                Currently accepting freelance projects and exploring full-time remote positions.
              </p>
            </Card>

            {/* Contact Details */}
            <Card>
              <h3 className="font-bold mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-tertiary rounded-lg">
                    <FiMail className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Email</div>
                    <a
                      href={`mailto:${import.meta.env.VITE_EMAIL}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-accent transition-colors"
                    >
                      {import.meta.env.VITE_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-tertiary rounded-lg">
                    <FiMapPin className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Location</div>
                    <span className="text-text-primary">Mombasa, Kenya</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-bg-tertiary rounded-lg">
                    <FiClock className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-text-muted">Timezone</div>
                    <span className="text-text-primary">EAT (UTC+03:00)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <Card>
              <h3 className="font-bold mb-4">Connect With Me</h3>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg hover:bg-border transition-colors group"
                  >
                    <social.icon size={20} className="text-text-secondary group-hover:text-accent transition-colors" />
                    <div>
                      <div className="font-medium text-sm">{social.name}</div>
                      <div className="text-text-muted text-xs">{social.username}</div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Response Time */}
            <div className="text-center py-4 px-6 bg-bg-secondary border border-border rounded-xl">
              <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
                <FiClock className="w-4 h-4 text-accent" />
                <span>Average response time: <strong className="text-text-primary">24 hours</strong></span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

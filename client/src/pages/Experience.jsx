import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { FiDownload, FiExternalLink, FiMapPin, FiCalendar, FiArrowRight, FiBookOpen, FiAward, FiBriefcase } from 'react-icons/fi';
import { HiOutlineSparkles, HiOutlineAcademicCap, HiOutlineBadgeCheck } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Badge, Button, Card } from '../components/ui';
import { useAnalytics } from '../hooks/useAnalytics';
import axios from 'axios';

// Mock data - will be replaced with API data
const workExperience = [
  {
    id: 1,
    company: 'Freelance',
    logo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop',
    title: 'Full-Stack Developer',
    type: 'Self-employed',
    startDate: 'Jan 2024',
    endDate: 'Present',
    location: 'Remote',
    description: [
      'Building full-stack web applications using the MERN stack (MongoDB, Express, React, Node.js)',
      'Developing RESTful APIs and integrating them with responsive React frontends',
      'Implementing authentication systems using JWT and secure user management',
      'Learning and applying best practices in code organization and component architecture',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
  },
  {
    id: 2,
    company: 'Personal Projects',
    logo: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop',
    title: 'Web Developer',
    type: 'Learning & Building',
    startDate: 'Jun 2024',
    endDate: 'Dec 2024',
    location: 'Self-directed',
    description: [
      'Completed multiple personal projects to solidify MERN stack fundamentals',
      'Built e-commerce, portfolio, and blog applications with full CRUD functionality',
      'Practiced responsive design and modern CSS frameworks like Tailwind',
      'Contributed to open-source projects and collaborated with other developers on GitHub',
    ],
    technologies: ['React', 'Express', 'MongoDB', 'CSS', 'Git'],
  },
];

const education = [
  {
    id: 1,
    institution: 'Technical University of Mombasa',
    degree: 'Diploma in Computer Science',
    field: 'Computer Science',
    startYear: '2023',
    endYear: '2025',
    location: 'Mombasa, Kenya',
    achievements: ['Completed 300+ hours of coursework', 'Algorithms & Data Structures'],
  },
  {
    id: 2,
    institution: 'Power Learn Project Africa',
    degree: 'Software Development ',
    field: 'MERN Stack',
    startYear: '2025',
    endYear: '2025',
    location: 'Online',
    achievements: ['Built 8+ full-stack projectss', 'Responsive Web Design'],
  },
];

const certifications = [
  {
    id: 1,
    name: 'JavaScript Algorithms & Data Structures',
    issuer: 'freeCodeCamp',
    date: '2024',
    url: '#',
  },
  {
    id: 2,
    name: 'React Basics',
    issuer: 'Power Learn Project',
    date: '2024',
    url: 'https://academy.powerlearnprojectafrica.org/',
  },
  {
    id: 3,
    name: 'MongoDB Basics',
    issuer: 'Power Learn Project',
    date: '2024',
    url: 'https://academy.powerlearnprojectafrica.org/',
  },
];

const experienceStats = [
  { icon: FiBriefcase, label: 'Year Experience', value: '1+' },
  { icon: FiBookOpen, label: 'Projects Built', value: '8+' },
  { icon: FiAward, label: 'Certifications', value: '3' },
  { icon: HiOutlineAcademicCap, label: 'Courses Done', value: '10+' },
];

const Experience = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { trackLinkClick, trackDownload } = useAnalytics();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    // Fetch settings to get resume URL
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings/public`);
        if (response.data.data?.resumeUrl) {
          setResumeUrl(response.data.data.resumeUrl);
        }
      } catch (error) {
        console.warn('Failed to fetch resume URL:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleResumeClick = useCallback(() => {
    if (resumeUrl) {
      trackDownload('cv');
      // Construct full URL for resume download (without /api prefix)
      const serverUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const fullUrl = resumeUrl.startsWith('http') 
        ? resumeUrl 
        : `${serverUrl}${resumeUrl}`;
      
      // Open in new tab to bypass React Router
      const link = document.createElement('a');
      link.href = fullUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [resumeUrl, trackDownload]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative flex items-center justify-center overflow-hidden">
        <img 
          src="https://i.pinimg.com/736x/4b/2a/d0/4b2ad07bbe78bc4a746ccd62fb2dd786.jpg"
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
              My Journey
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Experience & <span className="text-accent">Education</span>
            </h1>
            
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-10 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
              My learning journey as a Computer Science student and self-taught MERN stack developer, building real-world projects and continuously expanding my skill set.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {experienceStats.map((stat, index) => (
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

      <div className="container-custom py-16">

        {/* Work Experience Timeline */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <FiBriefcase className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Work Experience</h2>
              <p className="text-text-muted text-sm">Building real-world projects</p>
            </div>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-8">
              {workExperience.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative md:pl-16"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 top-8 w-5 h-5 bg-accent rounded-full border-4 border-bg-primary hidden md:block" />

                  <Card className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Company Logo */}
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-16 h-16 rounded-lg object-cover border border-border"
                      />

                      <div className="flex-grow">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-xl font-bold">{job.title}</h3>
                            <p className="text-accent font-medium">{job.company}</p>
                          </div>
                          <Badge variant="accent">{job.type}</Badge>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 text-sm text-text-secondary mb-4">
                          <span className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            {job.startDate} — {job.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMapPin size={14} />
                            {job.location}
                          </span>
                        </div>

                        {/* Description */}
                        <ul className="space-y-2 mb-4">
                          {job.description.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-text-secondary">
                              <span className="text-accent mt-1.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2">
                          {job.technologies.map((tech) => (
                            <Badge key={tech} size="sm">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <HiOutlineAcademicCap className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Education</h2>
              <p className="text-text-muted text-sm">Self-taught with online courses</p>
            </div>
          </motion.div>

          <div className="grid gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{edu.institution}</h3>
                      <p className="text-accent font-medium">
                        {edu.degree} in {edu.field}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={14} />
                          {edu.startYear} — {edu.endYear}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin size={14} />
                          {edu.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((achievement) => (
                        <Badge key={achievement} variant="success" size="sm">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <HiOutlineBadgeCheck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Certifications</h2>
              <p className="text-text-muted text-sm">Verified achievements</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <h3 className="font-bold mb-1">{cert.name}</h3>
                  <p className="text-text-secondary text-sm mb-2">{cert.issuer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">{cert.date}</span>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent text-sm hover:underline flex items-center gap-1"
                    >
                      View <FiExternalLink size={12} />
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-16 px-8 bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border rounded-2xl"
        >
          <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiDownload className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Want the Full Picture?</h3>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Download my complete résumé with all details about my journey, projects, and skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="group px-10 py-4 text-base" onClick={handleResumeClick} disabled={!resumeUrl}>
                <FiDownload className="w-5 h-5 group-hover:animate-bounce" />
                Download Résumé
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="px-10 py-4 text-base">
                  Get in Touch
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;

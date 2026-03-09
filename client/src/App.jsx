import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ScrollToTop } from './components/layout';
import { ThemeProvider } from './context';
import { 
  Home, 
  About, 
  Skills, 
  Projects, 
  ProjectDetail,
  Experience, 
  Blog, 
  BlogDetail,
  Contact 
} from './pages';

// Admin imports
import { AuthProvider } from './admin/context/AuthContext';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/components/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import ProjectsListPage from './admin/pages/ProjectsListPage';
import ProjectFormPage from './admin/pages/ProjectFormPage';
import BlogListPage from './admin/pages/BlogListPage';
import BlogFormPage from './admin/pages/BlogFormPage';
import SkillsPage from './admin/pages/SkillsPage';
import ExperiencePage from './admin/pages/ExperiencePage';
import MediaPage from './admin/pages/MediaPage';
import MessagesPage from './admin/pages/MessagesPage';
import AnalyticsPage from './admin/pages/AnalyticsPage';
import SettingsPage from './admin/pages/SettingsPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Site */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="skills" element={<Skills />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="experience" element={<Experience />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Panel */}
          <Route path="/admin/*" element={
            <AuthProvider>
              <Routes>
                <Route path="login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="projects" element={<ProjectsListPage />} />
                    <Route path="projects/new" element={<ProjectFormPage />} />
                    <Route path="projects/:id/edit" element={<ProjectFormPage />} />
                    <Route path="blog" element={<BlogListPage />} />
                    <Route path="blog/new" element={<BlogFormPage />} />
                    <Route path="blog/:id/edit" element={<BlogFormPage />} />
                    <Route path="skills" element={<SkillsPage />} />
                    <Route path="experience" element={<ExperiencePage />} />
                    <Route path="media" element={<MediaPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

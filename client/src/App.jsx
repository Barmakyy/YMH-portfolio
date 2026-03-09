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
  Contact 
} from './pages';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="skills" element={<Skills />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="experience" element={<Experience />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

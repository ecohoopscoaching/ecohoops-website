import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Nonprofit from './pages/Nonprofit'
import Girls from './pages/Girls'
import Jr from './pages/Jr'
import Rep from './pages/Rep'
import About from './pages/About'
import Contact from './pages/Contact'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import PlayerProfile from './pages/PlayerProfile'
import Schedule from './pages/Schedule'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import AdminBlog from './pages/AdminBlog'
import AICoach from './pages/AICoach'
import BernsteinGuide from './pages/BernsteinGuide'
import Philosophy from './pages/Philosophy'
import Teams from './pages/Teams'
import PillarDetail from './pages/PillarDetail'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="nonprofit" element={<Nonprofit />} />
            <Route path="girls" element={<Girls />} />
            <Route path="jr" element={<Jr />} />
            <Route path="rep" element={<Rep />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="login" element={<Login />} />
            
            {/* Restored Routes */}
            <Route path="player/:teamId/:playerId" element={<PlayerProfile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="admin/blog/new" element={<AdminBlog />} />
            <Route path="coach" element={<AICoach />} />
            <Route path="guide" element={<BernsteinGuide />} />
            <Route path="philosophy" element={<Philosophy />} />
            <Route path="pillar/:slug" element={<PillarDetail />} />
            <Route path="teams" element={<Teams />} />
          </Route>
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}

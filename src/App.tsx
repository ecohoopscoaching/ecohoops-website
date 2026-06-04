import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import Philosophy from './pages/Philosophy'
import Teams from './pages/Teams'
import PlayerProfile from './pages/PlayerProfile'
import Schedule from './pages/Schedule'
import Videos from './pages/Videos'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Nonprofit from './pages/Nonprofit'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import AdminBlog from './pages/AdminBlog'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import AICoach from './pages/AICoach'
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="philosophy" element={<Philosophy />} />
        <Route path="teams" element={<Teams />} />
        <Route path="player/:teamId/:playerId" element={<PlayerProfile />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="videos" element={<Videos />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="nonprofit" element={<Nonprofit />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="coach" element={<AICoach />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/blog/new" element={<AdminBlog />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
    </AuthProvider>
  )
}

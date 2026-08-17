import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './pages/Home'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

// Lazy-load all secondary pages to dramatically improve initial page load speed
const Nonprofit = lazy(() => import('./pages/Nonprofit'))
const Girls = lazy(() => import('./pages/Girls'))
const Jr = lazy(() => import('./pages/Jr'))
const Rep = lazy(() => import('./pages/Rep'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Login = lazy(() => import('./pages/Login'))
const PlayerProfile = lazy(() => import('./pages/PlayerProfile'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const AdminBlog = lazy(() => import('./pages/AdminBlog'))
const AICoach = lazy(() => import('./pages/AICoach'))
const BernsteinGuide = lazy(() => import('./pages/BernsteinGuide'))
const Philosophy = lazy(() => import('./pages/Philosophy'))
const MarketingPlaybook = lazy(() => import('./pages/MarketingPlaybook'))
const Teams = lazy(() => import('./pages/Teams'))
const PillarDetail = lazy(() => import('./pages/PillarDetail'))
const Videos = lazy(() => import('./pages/Videos'))
const SafeSport = lazy(() => import('./pages/SafeSport'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'))
const Waiver = lazy(() => import('./pages/Waiver'))
const GirlsLandingPage = lazy(() => import('./pages/GirlsLandingPage'))

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-eco-blue/30 border-t-eco-blue rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="nonprofit" element={<Nonprofit />} />
              <Route path="girls" element={<Girls />} />
              <Route path="girls-tryouts" element={<GirlsLandingPage />} />
              <Route path="girls-grade-5-6" element={<GirlsLandingPage />} />
              <Route path="jr" element={<Jr />} />
              <Route path="rep" element={<Rep />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="register" element={<Register />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="login" element={<Login />} />
              <Route path="playbook" element={<MarketingPlaybook />} />
              
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
              <Route path="videos" element={<Videos />} />
              <Route path="safe-sport" element={<SafeSport />} />
              
              {/* Legal Routes */}
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="refund-policy" element={<RefundPolicy />} />
              <Route path="waiver" element={<Waiver />} />
            </Route>
          </Routes>
        </Suspense>
      </DataProvider>
    </AuthProvider>
  )
}


import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'

// Public pages
import HomePage from '../pages/HomePage.jsx'
import EventsPage from '../pages/EventsPage.jsx'
import TeamPage from '../pages/TeamPage.jsx'
import JoinPage from '../pages/JoinPage.jsx'

// Admin pages
import LoginPage from '../pages/admin/LoginPage.jsx'
import DashboardPage from '../pages/admin/DashboardPage.jsx'
import HomepageCMSPage from '../pages/admin/HomepageCMSPage.jsx'
import EventsCMSPage from '../pages/admin/EventsCMSPage.jsx'
import TeamCMSPage from '../pages/admin/TeamCMSPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/join" element={<JoinPage />} />
      </Route>

      {/* /admin → redirect to /admin/login */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      {/* Admin login (no layout wrapper) */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Protected admin routes — AdminLayout handles auth guard */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/admin/homepage" element={<HomepageCMSPage />} />
        <Route path="/admin/events" element={<EventsCMSPage />} />
        <Route path="/admin/team" element={<TeamCMSPage />} />
      </Route>
    </Routes>
  )
}

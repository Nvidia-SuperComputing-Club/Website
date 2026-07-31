import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PageLoader from '../components/ui/PageLoader.jsx'

// Layouts
import PublicLayout from '../layouts/PublicLayout.jsx'
import AdminLayout from '../layouts/AdminLayout.jsx'

// Public pages - Lazy Loaded
const HomePage = React.lazy(() => import('../pages/HomePage.jsx'))
const EventsPage = React.lazy(() => import('../pages/EventsPage.jsx'))
const TeamPage = React.lazy(() => import('../pages/TeamPage.jsx'))
const JoinPage = React.lazy(() => import('../pages/JoinPage.jsx'))

// Admin pages - Lazy Loaded
const LoginPage = React.lazy(() => import('../pages/admin/LoginPage.jsx'))
const DashboardPage = React.lazy(() => import('../pages/admin/DashboardPage.jsx'))
const HomepageCMSPage = React.lazy(() => import('../pages/admin/HomepageCMSPage.jsx'))
const EventsCMSPage = React.lazy(() => import('../pages/admin/EventsCMSPage.jsx'))
const TeamCMSPage = React.lazy(() => import('../pages/admin/TeamCMSPage.jsx'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  )
}

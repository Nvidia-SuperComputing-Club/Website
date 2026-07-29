import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout.jsx'
import HomePage from '../pages/HomePage.jsx'
import EventsPage from '../pages/EventsPage.jsx'
import TeamPage from '../pages/TeamPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/team" element={<TeamPage />} />
      </Route>
    </Routes>
  )
}

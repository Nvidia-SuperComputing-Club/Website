import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  Calendar, Users, TrendingUp, Plus, Clock, RefreshCw
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color = 'nvidia' }) {
  return (
    <div className="bg-bg-tertiary border border-white/10 rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl bg-${color}/15 border border-${color}/30`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-white">{value ?? '—'}</p>
        <p className="text-xs font-mono text-gray-400">{label}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ events: 0, team: 0, upcoming: 0, applications: 0 })
  const [recentApps, setRecentApps] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    const now = new Date().toISOString()

    const [eventsRes, teamRes, upcomingRes, appsRes] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('events').select('id', { count: 'exact', head: true }).gte('date', now),
      supabase.from('membership_applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ])

    setStats({
      events: eventsRes.count ?? 0,
      team: teamRes.count ?? 0,
      upcoming: upcomingRes.count ?? 0,
      applications: appsRes.count ?? 0,
    })

    // Recent membership applications
    const { data: apps } = await supabase
      .from('membership_applications')
      .select('id, full_name, email, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5)

    setRecentApps(apps ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchStats() }, [])

  const statusColor = (s) => ({
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    approved: 'text-nvidia bg-nvidia/10 border-nvidia/20',
    rejected: 'text-red-400 bg-red-400/10 border-red-400/20',
  }[s] ?? 'text-gray-400 bg-white/5 border-white/10')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-sm font-mono text-gray-400 mt-1">NVIDIA Club Admin Overview</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:border-nvidia/40 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Total Events" value={stats.events} />
        <StatCard icon={Users} label="Active Members" value={stats.team} />
        <StatCard icon={TrendingUp} label="Upcoming Events" value={stats.upcoming} />
        <StatCard icon={Clock} label="Pending Applications" value={stats.applications} color="yellow-400" />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono font-bold text-nvidia uppercase tracking-wider">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/events"
            id="admin-add-event"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nvidia text-black font-display font-bold text-sm hover:bg-nvidia-light transition-colors shadow-nvidia-glow"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </Link>
          <Link
            to="/admin/team"
            id="admin-add-member"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white font-display font-bold text-sm hover:border-nvidia/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Link>
          <Link
            to="/admin/homepage"
            id="admin-edit-homepage"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white font-display font-bold text-sm hover:border-nvidia/40 transition-colors"
          >
            Edit Homepage
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="space-y-3">
        <h2 className="text-sm font-mono font-bold text-nvidia uppercase tracking-wider">Recent Membership Applications</h2>
        <div className="bg-bg-secondary border border-white/10 rounded-xl overflow-hidden">
          {recentApps.length === 0 ? (
            <p className="text-center text-gray-500 font-mono text-sm py-10">No applications yet.</p>
          ) : (
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-gray-400 font-normal px-5 py-3">Name</th>
                  <th className="text-left text-gray-400 font-normal px-5 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left text-gray-400 font-normal px-5 py-3 hidden md:table-cell">Applied</th>
                  <th className="text-left text-gray-400 font-normal px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-3 text-white font-semibold">{app.full_name}</td>
                    <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{app.email}</td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

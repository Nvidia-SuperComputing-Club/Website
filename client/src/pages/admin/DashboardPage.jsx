import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import {
  Calendar, Users, TrendingUp, Plus, Clock, RefreshCw
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color = 'nvidia' }) {
  const colorMap = {
    'nvidia': { bg: 'bg-[#76B900]/15', border: 'border-[#76B900]/30', text: 'text-[#76B900]' },
    'yellow-400': { bg: 'bg-yellow-400/15', border: 'border-yellow-400/30', text: 'text-yellow-400' }
  };
  const theme = colorMap[color] || colorMap['nvidia'];

  return (
    <div className="bg-bg-tertiary border border-white/10 rounded-xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${theme.bg} border ${theme.border}`}>
        <Icon className={`w-5 h-5 ${theme.text}`} />
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
    try {
      const [statsRes, appsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/applications')
      ])

      setStats(statsRes.data)
      setRecentApps(appsRes.data ?? [])
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
    } finally {
      setLoading(false)
    }
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
                  <tr key={app._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
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

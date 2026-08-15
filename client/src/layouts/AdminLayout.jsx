import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import {
  LayoutDashboard, FileText, Calendar, Users, LogOut,
  Menu, X, Cpu, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/homepage', icon: FileText, label: 'Homepage CMS' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/team', icon: Users, label: 'Team' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const devBypass = import.meta.env.DEV && localStorage.getItem('dev_admin_bypass') === 'true'

    const fetchUser = async () => {
      try {
        if (devBypass) {
          setUser({ email: 'dev-admin@nvidia.club' })
          setLoading(false)
          return
        }
        const result = await api.get('/auth/me')
        setUser(result.data)
      } catch (err) {
        localStorage.removeItem('nvidia_sc_token')
        navigate('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('dev_admin_bypass')
    localStorage.removeItem('nvidia_sc_token')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Cpu className="w-10 h-10 text-nvidia animate-pulse" />
          <p className="text-gray-400 font-mono text-sm">Verifying session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 min-h-screen w-64 bg-bg-secondary border-r border-white/10 z-30
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="NVIDIA Club" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-xs font-display font-bold text-white">NVIDIA Club</p>
              <p className="text-[10px] font-mono text-nvidia">Admin CMS</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-mono transition-all group ${
                  isActive
                    ? 'bg-nvidia/15 text-nvidia border border-nvidia/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-nvidia/20 border border-nvidia/40 flex items-center justify-center text-nvidia font-bold text-xs">
              {user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono text-white truncate">{user?.email}</p>
              <p className="text-[10px] font-mono text-nvidia">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-mono text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-bg-secondary border-b border-white/10 flex items-center px-8 lg:px-10 gap-4 shrink-0">
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-gray-400 hover:text-nvidia transition-colors"
          >
            ↗ View Site
          </a>
        </header>

        {/* Page Content */}
        <main id="admin-main" className="flex-1 p-8 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

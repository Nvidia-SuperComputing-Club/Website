import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/supabaseService.js'
import { Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authService.login(email, password)
      if (data?.session?.access_token) {
        localStorage.setItem('nvidia_sc_token', data.session.access_token)
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-nvidia/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-nvidia/10 border border-nvidia/30 mb-4 shadow-nvidia-glow overflow-hidden">
            <img src="/favicon.png" alt="NVIDIA Club Logo" loading="lazy" decoding="async" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white">Admin CMS</h1>
          <p className="text-xs font-mono text-nvidia mt-1">NVIDIA Club @ Galgotias University</p>
        </div>

        <div className="bg-bg-secondary border border-white/10 rounded-2xl p-8 space-y-4 shadow-[0_0_40px_rgba(118,185,0,0.08)]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 justify-center mb-6">
            <Lock className="w-3.5 h-3.5 text-nvidia" />
            <span>Authorized administrators only</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-mono text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-sm font-mono placeholder:text-gray-600 focus:outline-none focus:border-nvidia/50 transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-tertiary border border-white/10 text-white text-sm font-mono placeholder:text-gray-600 focus:outline-none focus:border-nvidia/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-nvidia text-bg-primary font-display font-bold text-sm hover:bg-nvidia/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-bg-primary/30 border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {import.meta.env.DEV && (
            <button
              id="admin-login-bypass"
              onClick={() => {
                localStorage.setItem('dev_admin_bypass', 'true')
                navigate('/admin/dashboard')
              }}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-dashed border-nvidia/40 text-nvidia font-mono text-xs font-bold hover:bg-nvidia/10 transition-colors"
            >
              Development Bypass Login
            </button>
          )}

          <p className="text-center text-[10px] font-mono text-gray-600 pt-2">
            Access is restricted to club administrators.<br />
            Unauthorized access attempts are logged.
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs font-mono text-gray-500 hover:text-nvidia transition-colors">
            ← Back to public site
          </a>
        </div>
      </div>
    </div>
  )
}

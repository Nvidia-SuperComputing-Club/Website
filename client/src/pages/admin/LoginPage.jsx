import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Github, Lock } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null) // 'google' | 'github' | null
  const [error, setError] = useState(null)

  const handleOAuth = async (provider) => {
    setLoading(provider)
    setError(null)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/admin/dashboard`,
      },
    })
    if (err) {
      setError(err.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-nvidia/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-nvidia/10 border border-nvidia/30 mb-4 shadow-nvidia-glow overflow-hidden">
            <img src="/favicon.png" alt="NVIDIA Club Logo" loading="lazy" decoding="async" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white">Admin CMS</h1>
          <p className="text-xs font-mono text-nvidia mt-1">NVIDIA Club @ Galgotias University</p>
        </div>

        {/* Card */}
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

          {/* Google */}
          <button
            id="admin-login-google"
            onClick={() => handleOAuth('google')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-900 font-display font-bold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'google' ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Sign in with Google
          </button>

          {/* GitHub */}
          <button
            id="admin-login-github"
            onClick={() => handleOAuth('github')}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-bg-tertiary border border-white/10 text-white font-display font-bold text-sm hover:border-nvidia/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'github' ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            Sign in with GitHub
          </button>

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

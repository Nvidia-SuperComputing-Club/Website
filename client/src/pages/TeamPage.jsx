import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Building2, Sparkles, Award, User } from 'lucide-react'
import AnimatedTeamSection from '../components/sections/AnimatedTeamSection.jsx'

const getInitials = (name) => {
  if (!name) return 'TM'
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function TeamPage() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await api.get('/team?limit=50')
        const data = result.data || []
        const activeMembers = data.filter(m => m.is_active !== false)
        setTeam(activeMembers)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
          <Building2 className="w-3.5 h-3.5" />
          <span>GALGOTIAS UNIVERSITY CHAPTER</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          PIONEERING GPU COMPUTING AT <br />
          <span className="text-nvidia">GALGOTIAS UNIVERSITY</span>
        </h1>
        <p className="text-gray-300 text-base leading-relaxed font-sans">
          The NVIDIA Club at Galgotias University brings together student engineers, computer scientists, and AI researchers to push the boundaries of parallel computing, computer vision, and deep learning on our flagship <span className="text-nvidia font-mono font-bold">NVIDIA DGX H200</span> node.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="nvidia-card rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-nvidia/10 border border-nvidia/30 text-nvidia flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Our Campus Mission</h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            We democratize high-performance supercomputing access for Galgotias University students. Combining official NVIDIA Deep Learning Institute curriculum with real-world hardware labs, we equip members with industry-ready CUDA optimization skills.
          </p>
        </div>

        <div className="nvidia-card rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">NVIDIA Academic Chapter</h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            As an officially recognized NVIDIA DLI University Chapter at Galgotias University, our members gain direct access to official hardware grants, NVIDIA research webinars, and priority sponsorship for national hackathons.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-nvidia uppercase">EXECUTIVE BOARD</span>
          <h2 className="text-3xl font-display font-bold text-white">GALGOTIAS STUDENT OFFICERS</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="nvidia-card rounded-2xl p-5 space-y-4 flex flex-col justify-between animate-pulse">
                <div className="space-y-4">
                  <div className="h-48 rounded-xl bg-white/5 border border-white/5" />
                  <div className="h-5 w-2/3 bg-white/10 rounded" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                  <div className="h-12 w-full bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error && team.length === 0 ? (
          <div className="text-center py-12 bg-red-900/20 border border-red-500/30 rounded-2xl">
            <p className="text-red-400 font-mono text-sm">Failed to load team: {error}</p>
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-12 bg-obsidian-900/40 rounded-2xl border border-dashed border-white/10">
            <User className="w-12 h-12 text-nvidia mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-display font-semibold text-white">No active team officers listed</h4>
            <p className="text-sm font-mono text-gray-400 mt-1">Check back soon for new club executives.</p>
          </div>
        ) : (
          <AnimatedTeamSection members={team} />
        )}
      </div>
    </div>
  )
}

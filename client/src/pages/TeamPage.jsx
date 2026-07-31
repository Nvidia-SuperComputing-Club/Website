import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Github, Linkedin, Twitter, Building2, Sparkles, Award, User } from 'lucide-react'

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

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      if (!error && data) {
        setTeam(data)
      }
      setLoading(false)
    }
    fetchTeam()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-20">
      {/* Page Header */}
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

      {/* Mission & History Grid */}
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

      {/* Leadership & Officer Team Grid */}
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
        ) : team.length === 0 ? (
          <div className="text-center py-12 bg-obsidian-900/40 rounded-2xl border border-dashed border-white/10">
            <User className="w-12 h-12 text-nvidia mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-display font-semibold text-white">No active team officers listed</h4>
            <p className="text-sm font-mono text-gray-400 mt-1">Check back soon for new club executives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.id} className="nvidia-card rounded-2xl overflow-hidden p-5 space-y-4 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-xl overflow-hidden bg-obsidian-950 flex items-center justify-center border border-nvidia/20">
                    {member.image_url ? (
                      <img 
                        src={member.image_url?.includes('cloudinary.com') ? member.image_url.replace('/upload/', '/upload/f_auto,q_auto/') : member.image_url} 
                        alt={member.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-nvidia/10 border border-nvidia/30 text-nvidia flex items-center justify-center text-2xl font-display font-bold">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-obsidian-950/80 border border-nvidia/30 text-[10px] font-mono text-nvidia">
                      CLASS OF {member.graduation_year || '2026'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-nvidia transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-mono text-nvidia font-medium mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed font-sans">
                      {member.bio}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-gray-400">
                  {member.github_url && (
                    <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-nvidia transition-colors" aria-label={`${member.name} GitHub`}>
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-nvidia transition-colors" aria-label={`${member.name} LinkedIn`}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-nvidia transition-colors" aria-label={`${member.name} Twitter`}>
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

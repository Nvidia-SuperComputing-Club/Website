import { Building2, GraduationCap, Rocket, Users } from 'lucide-react'
import { useInView } from '../../hooks/useScrollAnimation.js'

export default function CommunitiesSection() {
  const [headerRef, headerVisible] = useInView()
  const [cardsRef, cardsVisible] = useInView({ threshold: 0.1 })

  return (
    <section className="py-20 bg-obsidian-900/50 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div
          ref={headerRef}
          className={`text-center space-y-3 max-w-3xl mx-auto reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
            <Building2 className="w-3.5 h-3.5" />
            <span>GALGOTIAS UNIVERSITY PARTNERSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            STUDENT-LED NVIDIA COMMUNITIES
          </h2>
          <p className="text-sm text-gray-300 font-sans leading-relaxed">
            The student-led bodies that operationalize this partnership across Galgotias University.
          </p>
        </div>

        <div
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children ${cardsVisible ? 'is-visible' : ''}`}
        >
          {/* Card 1: NVIDIA DLI Student Chapters */}
          <div className="stagger-child nvidia-card rounded-2xl p-8 space-y-4 flex flex-col justify-between border border-nvidia/30 bg-obsidian-950/80 shadow-nvidia-glow">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-nvidia/10 border border-nvidia/30 text-nvidia flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-nvidia bg-nvidia/10 px-2.5 py-1 rounded border border-nvidia/20 font-bold inline-block">
                CERTIFICATION & WORKSHOPS
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                NVIDIA Deep Learning Institute (DLI) Student Chapters
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                The university hosts active student groups focused on NVIDIA DLI certifications. These clubs organize workshops where students gain hands-on experience with NVIDIA GPUs and earn globally recognized credentials in deep learning and accelerated computing.
              </p>
            </div>
          </div>

          {/* Card 2: AI & Data Science Societies */}
          <div className="stagger-child nvidia-card rounded-2xl p-8 space-y-4 flex flex-col justify-between border border-cyber-cyan/30 bg-obsidian-950/80">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 px-2.5 py-1 rounded border border-cyber-cyan/20 font-bold inline-block">
                RESEARCH & INCUBATION
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                AI & Data Science Societies
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Under the umbrella of the Tech Council and Student Council, specialized clubs (such as the AI Research Society) utilize the DGX H200 supercomputer for student projects, hackathons, and startup incubation (e.g., ventures like Cybergenix).
              </p>
            </div>
          </div>

          {/* Card 3: Campus Ambassador Programs */}
          <div className="stagger-child nvidia-card rounded-2xl p-8 space-y-4 flex flex-col justify-between border border-white/10 bg-obsidian-950/80">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center">
                <Users className="w-6 h-6 text-nvidia" />
              </div>
              <span className="text-[10px] font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded border border-white/10 font-bold inline-block">
                PEER LEADERSHIP
              </span>
              <h3 className="text-xl font-display font-bold text-white">
                Campus Ambassador Programs
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Students actively participate in the NVIDIA University Ambassador Program, serving as liaisons to promote AI literacy, organize campus events, and facilitate peer-to-peer learning on GPU technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

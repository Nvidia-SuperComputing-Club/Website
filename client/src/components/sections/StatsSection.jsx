import { Users, Calendar, Layers, Building2 } from 'lucide-react'
import { useInView, useCountUp } from '../../hooks/useScrollAnimation.js'

const STATS = [
  {
    icon: Users,
    value: '150+',
    target: 150,
    suffix: '+',
    label: 'ACTIVE MEMBERS',
    color: 'text-nvidia',
    border: 'border-nvidia/40 shadow-nvidia-glow',
  },
  {
    icon: Calendar,
    value: '20+',
    target: 20,
    suffix: '+',
    label: 'EVENTS HOSTED',
    color: 'text-cyber-cyan',
    border: 'border-cyber-cyan/30',
  },
  {
    icon: Layers,
    value: '10+',
    target: 10,
    suffix: '+',
    label: 'GPU PROJECTS',
    color: 'text-nvidia',
    border: 'border-white/10',
  },
  {
    icon: Building2,
    value: '5+',
    target: 5,
    suffix: '+',
    label: 'PARTNERS',
    color: 'text-white',
    border: 'border-white/10',
  },
]

export default function StatsSection() {
  const [headerRef, headerVisible] = useInView()
  const statsRef = useCountUp()

  return (
    <section className="py-20 bg-obsidian-900/40 border-y border-white/5 relative overflow-hidden" aria-labelledby="stats-heading">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-nvidia/5 via-transparent to-cyber-cyan/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div
          ref={headerRef}
          className={`text-center space-y-3 max-w-2xl mx-auto reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>GALGOTIAS CHAPTER METRICS</span>
          </div>
          <h2 id="stats-heading" className="text-3xl sm:text-4xl font-display font-bold text-white">
            SOCIETY IMPACT &amp; NUMBERS
          </h2>
          <p className="text-gray-400 text-sm font-sans">
            Empowering student engineers and GPU researchers across Galgotias University.
          </p>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children"
        >
          {STATS.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className={`stagger-child nvidia-card rounded-2xl p-6 space-y-4 flex flex-col justify-between border ${stat.border} hover:scale-105 transition-transform duration-300`}>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-obsidian-950 border border-nvidia/20 flex items-center justify-center text-nvidia">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`text-4xl font-bold font-mono ${stat.color}`}>
                    <span data-target={stat.target} data-suffix={stat.suffix}>0{stat.suffix}</span>
                  </div>
                  <div className="text-xs font-mono text-gray-300 tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

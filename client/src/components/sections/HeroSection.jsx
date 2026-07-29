import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Building2 } from 'lucide-react'
import { CircuitCanvas } from '../3d/CircuitCanvas.jsx'

const HERO_STATS = [
  { value: '150+', label: 'MEMBERS', color: 'text-nvidia', border: 'border-nvidia/40 shadow-nvidia-glow' },
  { value: '20+', label: 'EVENTS HOSTED', color: 'text-cyber-cyan', border: 'border-cyber-cyan/30' },
  { value: '10+', label: 'PROJECTS', color: 'text-nvidia', border: 'border-white/5' },
  { value: '5+', label: 'PARTNERS', color: 'text-white', border: 'border-white/5' },
]

export default function HeroSection() {
  return (
    <section className="relative h-[100dvh] min-h-[580px] max-h-[820px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 border-b border-white/10 px-4 pt-20 pb-5">
      {/* Circuit Board Canvas Micro-animation */}
      <CircuitCanvas />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-nvidia/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyber-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Centered Vertically */}
      <div className="relative z-10 max-w-5xl mx-auto my-auto text-center space-y-4 sm:space-y-5">
        {/* NVIDIA Partner & Galgotias Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-obsidian-900/90 border border-nvidia/40 backdrop-blur-md shadow-nvidia-glow">
          <Building2 className="w-3.5 h-3.5 text-nvidia" />
          <span className="text-[11px] sm:text-xs font-mono text-gray-200">
            GALGOTIAS UNIVERSITY <span className="text-nvidia font-bold">NVIDIA CLUB</span>
          </span>
        </div>

        {/* Hero Headline — 6xl scale balanced for 100vh fit */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
          ACCELERATING THE FUTURE OF <br />
          <span className="text-nvidia-gradient">ARTIFICIAL INTELLIGENCE</span>
        </h1>

        {/* Mission Subtitle */}
        <p className="max-w-2xl mx-auto text-xs sm:text-sm lg:text-base text-gray-300 font-sans leading-relaxed">
          The premier student technology society at Galgotias University powered by our flagship <span className="text-nvidia font-mono font-bold">NVIDIA DGX H200</span> supercomputer, deep learning research, parallel CUDA kernels, and hardware hackathons.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
          <Link
            to="/events"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-xs sm:text-sm shadow-nvidia-glow hover:shadow-nvidia-glow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Join Society</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/events"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-850 border border-white/10 hover:border-nvidia/40 text-white font-display font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-nvidia" />
            <span>Explore Events</span>
          </Link>
        </div>

        {/* Stats Strip — Perfectly pinned inside the 100vh fold */}
        <div className="pt-3 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left font-mono">
          {HERO_STATS.map((stat, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl bg-obsidian-900/70 border ${stat.border} backdrop-blur-md`}>
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] sm:text-[11px] text-gray-300 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

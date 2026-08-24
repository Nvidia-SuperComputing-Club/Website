import { Link } from 'react-router-dom'
import { useInView } from '../../hooks/useScrollAnimation.js'

export default function JoinCTA() {
  const [ref, isVisible] = useInView({ threshold: 0.2 })

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        ref={ref}
        className={`p-2 rounded-[2.5rem] bg-white/5 border border-nvidia/30 shadow-nvidia-glow-lg reveal-scale ${
          isVisible ? 'is-visible' : ''
        }`}
      >
        <div className="relative rounded-[calc(2.5rem-0.5rem)] bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-950 border border-white/5 p-8 sm:p-14 overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3.5 py-1.5 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono font-medium tracking-wider inline-block">
              GALGOTIAS UNIVERSITY STUDENT INTAKE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              READY TO BUILD ON <span className="text-nvidia">NVIDIA DGX H200?</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-300 font-sans">
              Access the Galgotias University NVIDIA DGX H200 supercomputer, earn official certifications, and compete in national AI hackathons.
            </p>
          </div>
          <Link
            to="/events"
            className="shrink-0 px-8 py-3.5 rounded-full bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-base shadow-nvidia-glow transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98]"
          >
            <span>Apply for Membership</span>
            <span className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'

export default function JoinCTA() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-950 border border-nvidia/40 p-8 sm:p-14 overflow-hidden shadow-nvidia-glow-lg text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono inline-block">
            GALGOTIAS UNIVERSITY STUDENT INTAKE
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            READY TO BUILD ON <span className="text-nvidia">NVIDIA DGX H200?</span>
          </h2>
          <p className="text-sm text-gray-300 font-sans">
            Access the Galgotias University NVIDIA DGX H200 supercomputer, earn official certifications, and compete in national AI hackathons.
          </p>
        </div>
        <Link
          to="/events"
          className="shrink-0 px-8 py-4 rounded-xl bg-nvidia hover:bg-nvidia-light text-black font-display font-bold text-base shadow-nvidia-glow transition-all duration-300"
        >
          Apply for Membership
        </Link>
      </div>
    </section>
  )
}

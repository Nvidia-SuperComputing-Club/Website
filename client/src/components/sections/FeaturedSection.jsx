import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react'
import { useInView } from '../../hooks/useScrollAnimation.js'

const FEATURED_EVENTS = [
  {
    id: 1,
    title: 'CUDA Workshop Series',
    description: 'Hands-on CUDA programming workshop covering parallel thread execution, shared memory, and warp synchronization.',
    date: 'Aug 15, 2026',
    category: 'Workshop',
  },
  {
    id: 2,
    title: 'DGX H100 Hackathon',
    description: '24-hour GPU coding competition focused on optimizing Transformer fine-tuning pipelines on NVIDIA hardware.',
    date: 'Sep 1, 2026',
    category: 'Hackathon',
  },
  {
    id: 3,
    title: 'TensorRT-LLM Masterclass',
    description: 'Technical talk on quantizing 70B+ LLM foundation models for high-throughput inference.',
    date: 'Sep 20, 2026',
    category: 'Talk',
  },
]

export default function FeaturedSection() {
  const [headerRef, headerVisible] = useInView()
  const [cardsRef, cardsVisible] = useInView({ threshold: 0.1 })

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" aria-label="Featured events">
      <div
        ref={headerRef}
        className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6 reveal ${headerVisible ? 'is-visible' : ''}`}
      >
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono font-medium tracking-wider inline-block">
            FEATURED HIGHLIGHTS
          </span>
          <h2 className="text-3xl font-display font-bold text-white">UPCOMING EVENTS</h2>
        </div>
        <Link to="/events" className="text-xs font-mono font-bold text-nvidia hover:underline flex items-center gap-2 group">
          <span>VIEW ALL EVENTS</span>
          <span className="w-6 h-6 rounded-full bg-nvidia/10 border border-nvidia/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      <div
        ref={cardsRef}
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children ${cardsVisible ? 'is-visible' : ''}`}
        role="list"
      >
        {FEATURED_EVENTS.map((event) => (
          <article key={event.id} className="stagger-child p-1.5 rounded-[2rem] bg-white/5 border border-white/10 hover:border-nvidia/40 transition-colors group" role="listitem">
            <div className="p-6 rounded-[calc(2rem-0.375rem)] bg-obsidian-900 border border-white/5 space-y-4 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-nvidia bg-nvidia/10 px-2.5 py-1 rounded-full border border-nvidia/20 font-bold tracking-wider">
                    {event.category.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-nvidia" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white group-hover:text-nvidia transition-colors">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <Link to="/events" className="pt-4 border-t border-white/10 text-xs font-mono font-bold text-nvidia flex items-center justify-between group/link">
                <span>EVENT DETAILS</span>
                <span className="w-6 h-6 rounded-full bg-nvidia/10 border border-nvidia/20 flex items-center justify-center group-hover/link:translate-x-1 group-hover/link:bg-nvidia group-hover/link:text-black transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

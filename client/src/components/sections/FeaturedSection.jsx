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
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10" aria-label="Featured events">
      <div
        ref={headerRef}
        className={`flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6 reveal ${headerVisible ? 'is-visible' : ''}`}
      >
        <div className="space-y-2">
          <span className="text-xs font-mono text-nvidia uppercase tracking-wider">FEATURED HIGHLIGHTS</span>
          <h2 className="text-3xl font-display font-bold text-white">UPCOMING EVENTS</h2>
        </div>
        <Link to="/events" className="text-sm font-semibold text-nvidia hover:underline flex items-center gap-1 group">
          <span>View All Events</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div
        ref={cardsRef}
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children ${cardsVisible ? 'is-visible' : ''}`}
        role="list"
      >
        {FEATURED_EVENTS.map((event) => (
          <article key={event.id} className="stagger-child nvidia-card p-6 space-y-4 flex flex-col justify-between group" role="listitem">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-nvidia bg-nvidia/10 px-2.5 py-1 rounded border border-nvidia/20 font-semibold">
                  {event.category.toUpperCase()}
                </span>
                <div className="flex items-center gap-1 text-xs text-text-tertiary font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.date}</span>
                </div>
              </div>

              <h3 className="text-xl font-display font-bold text-white group-hover:text-nvidia transition-colors">
                {event.title}
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed">
                {event.description}
              </p>
            </div>

            <Link to="/events" className="pt-4 border-t border-white/10 text-sm font-semibold text-nvidia flex items-center gap-2 group/link">
              <span>Event Details</span>
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

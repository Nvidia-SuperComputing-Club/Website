import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import { Calendar, MapPin, ExternalLink, Image as ImageIcon, X, Filter } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTab, setSelectedTab] = useState('upcoming')
  const [activeGalleryImages, setActiveGalleryImages] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await api.get('/events?limit=50')
        setEvents(result.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]

  const normDate = (d) => {
    if (!d) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? d : parsed.toISOString().split('T')[0]
  }

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const evDate = normDate(ev.date?.slice(0, 10) || ev.date)
      const isPast = evDate < todayStr
      const matchesTab = selectedTab === 'past' ? isPast : !isPast
      const matchesType = selectedType === 'all' || ev.category === selectedType
      return matchesTab && matchesType
    })
  }, [events, selectedTab, selectedType, todayStr])

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center py-16 bg-red-900/20 border border-red-500/30 rounded-2xl">
          <p className="text-red-400 font-mono text-sm">Failed to load events: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-nvidia/10 border border-nvidia/30 text-nvidia text-xs font-mono">
          <Calendar className="w-3.5 h-3.5" />
          <span>EVENTS & WORKSHOPS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          UPCOMING HACKATHONS & <br />
          <span className="text-nvidia">TECHNICAL MASTERCLASSES</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          From 24-hour GPU coding sprints to hands-on TensorRT quantization masterclasses, join our weekly events on campus.
        </p>
      </div>

      {/* Filterable Event Schedule Island */}
      <div className="space-y-8">
        {/* Tab Switcher & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-obsidian-900/90 p-4 rounded-2xl border border-white/10">
          {/* Upcoming vs Past Tabs */}
          <div className="flex bg-obsidian-950 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`flex-1 sm:px-6 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedTab === 'upcoming'
                  ? 'bg-nvidia text-black shadow-nvidia-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming Schedule
            </button>
            <button
              onClick={() => setSelectedTab('past')}
              className={`flex-1 sm:px-6 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedTab === 'past'
                  ? 'bg-nvidia text-black shadow-nvidia-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Past Archives
            </button>
          </div>

          {/* Type Category Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-nvidia shrink-0 ml-2 hidden sm:block" />
            {['all', 'hackathon', 'workshop', 'talk'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                  selectedType === t
                    ? 'bg-obsidian-800 border border-nvidia text-nvidia font-bold'
                    : 'bg-obsidian-950 text-gray-400 border border-white/5 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-nvidia border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 font-mono text-sm mt-4">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-obsidian-900/40 rounded-2xl border border-dashed border-white/10">
            <Calendar className="w-12 h-12 text-nvidia mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-display font-semibold text-white">No events in this category</h4>
            <p className="text-sm font-mono text-gray-400 mt-1">Check back soon for new club sessions or switch filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id || event.id}
                className="nvidia-card rounded-2xl overflow-hidden p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-nvidia/10 border border-nvidia/30 text-nvidia text-[11px] font-mono font-bold uppercase">
                      {event.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-nvidia" />
                      <span>{event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-nvidia transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-nvidia shrink-0" />
                    <span className="truncate max-w-[140px]">{event.location || 'TBD'}</span>
                  </div>

                  {event.registrationUrl && selectedTab === 'upcoming' && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-nvidia text-black font-display text-xs font-bold hover:bg-nvidia-light transition-colors shadow-nvidia-glow flex items-center gap-1"
                    >
                      <span>RSVP</span>
                      <ExternalLink className="w-3.5 h-3.5" />
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

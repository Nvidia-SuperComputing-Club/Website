import { useState, useMemo } from 'react'
import { Calendar, MapPin, ExternalLink, Image as ImageIcon, X, Filter } from 'lucide-react'

const MOCK_EVENTS = [
  {
    slug: 'cuda-workshop-series',
    title: 'CUDA Workshop Series — Memory Hierarchy',
    date: '2026-08-15',
    time: '10:00 AM IST',
    location: 'Room 301, CS Building',
    type: 'workshop',
    summary: 'Deep dive into GPU memory hierarchy: global, shared, L1/L2 cache. Hands-on exercises optimizing matrix multiplication kernels.',
    registrationUrl: 'https://galgotiasuniversity.edu.in',
  },
  {
    slug: 'dgx-h200-hackathon',
    title: 'DGX H200 48-Hour Hackathon',
    date: '2026-09-01',
    time: '09:00 AM IST',
    location: 'C-Block Auditorium',
    type: 'hackathon',
    summary: 'Build an end-to-end LLM fine-tuning pipeline with real-time access to our flagship DGX H200 supercomputer. Cash prizes of ₹2,50,000.',
    registrationUrl: 'https://galgotiasuniversity.edu.in',
  },
  {
    slug: 'tensorrt-llm-masterclass',
    title: 'LLM Fine-Tuning with TensorRT-LLM',
    date: '2026-09-20',
    time: '02:00 PM IST',
    location: 'Online + Campus Stream',
    type: 'talk',
    summary: 'Masterclass on quantizing and deploying 70B+ parameter models using TensorRT-LLM and FlashAttention-2 optimizations.',
    registrationUrl: 'https://galgotiasuniversity.edu.in',
  },
  {
    slug: 'cuda-intro-session',
    title: 'Introduction to Parallel Computing & CUDA C++',
    date: '2026-05-10',
    time: '11:00 AM IST',
    location: 'Computer Lab Block A',
    type: 'workshop',
    summary: 'Foundational workshop on threads, blocks, grids, and writing your first CUDA C++ vector addition kernel.',
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    slug: 'nvidia-dli-cert-day',
    title: 'NVIDIA DLI Certification Day 2026',
    date: '2026-04-15',
    time: '10:00 AM IST',
    location: 'Seminar Hall 2',
    type: 'talk',
    summary: 'Official NVIDIA Deep Learning Institute certification workshop. Students earned globally recognized credentials in accelerated computing.',
    gallery: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    ],
  },
]

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedTab, setSelectedTab] = useState('upcoming')
  const [activeGalleryImages, setActiveGalleryImages] = useState(null)

  const todayStr = new Date().toISOString().split('T')[0]

  const normDate = (d) => {
    if (!d) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d
    const parsed = new Date(d)
    return isNaN(parsed.getTime()) ? d : parsed.toISOString().split('T')[0]
  }

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((ev) => {
      const evDate = normDate(ev.date)
      const isPast = evDate < todayStr
      const matchesTab = selectedTab === 'past' ? isPast : !isPast
      const matchesType = selectedType === 'all' || ev.type === selectedType
      return matchesTab && matchesType
    })
  }, [selectedTab, selectedType, todayStr])

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
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-obsidian-900/40 rounded-2xl border border-dashed border-white/10">
            <Calendar className="w-12 h-12 text-nvidia mx-auto mb-3 opacity-40" />
            <h4 className="text-lg font-display font-semibold text-white">No events in this category</h4>
            <p className="text-sm font-mono text-gray-400 mt-1">Check back soon for new club sessions or switch filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.slug}
                className="nvidia-card rounded-2xl overflow-hidden p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-nvidia/10 border border-nvidia/30 text-nvidia text-[11px] font-mono font-bold uppercase">
                      {event.type}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-nvidia" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white group-hover:text-nvidia transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                    {event.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-nvidia shrink-0" />
                    <span className="truncate max-w-[140px]">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedTab === 'upcoming' && event.registrationUrl && (
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

                    {selectedTab === 'past' && event.gallery && event.gallery.length > 0 && (
                      <button
                        onClick={() => setActiveGalleryImages(event.gallery)}
                        className="px-3 py-1.5 rounded-lg bg-obsidian-800 border border-white/10 text-nvidia text-xs font-mono hover:border-nvidia transition-colors flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Photos ({event.gallery.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Past Event Image Gallery Modal */}
        {activeGalleryImages && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-obsidian-900 border border-nvidia/40 rounded-2xl p-6 shadow-nvidia-glow-lg flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-nvidia" />
                  <span>Event Gallery</span>
                </h3>
                <button
                  onClick={() => setActiveGalleryImages(null)}
                  className="p-1.5 rounded-lg bg-obsidian-800 text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-1">
                {activeGalleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-obsidian-950 aspect-video">
                    <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

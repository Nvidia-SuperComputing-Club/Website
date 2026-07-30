import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Plus, Pencil, Trash2, Star, StarOff, Search, X, Save,
  Calendar, MapPin, Tag, AlignLeft, Image as ImageIcon
} from 'lucide-react'

const CATEGORIES = ['workshop', 'hackathon', 'talk', 'social']
const EMPTY_FORM = {
  title: '', description: '', date: '', location: '',
  category: 'workshop', image_url: '', is_featured: false,
}

function Toast({ msg, type }) {
  if (!msg) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-mono shadow-lg border ${
      type === 'error'
        ? 'bg-red-900/80 border-red-500/40 text-red-200'
        : 'bg-nvidia/20 border-nvidia/40 text-white'
    }`}>
      {msg}
    </div>
  )
}

export default function EventsCMSPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modal, setModal] = useState(null) // null | 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false })
    if (error) showToast(error.message, 'error')
    else setEvents(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (ev) => {
    setForm({
      title: ev.title, description: ev.description ?? '',
      date: ev.date?.slice(0, 16) ?? '', location: ev.location ?? '',
      category: ev.category, image_url: ev.image_url ?? '', is_featured: ev.is_featured,
    })
    setEditId(ev.id)
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form }
    let error
    if (modal === 'create') {
      ({ error } = await supabase.from('events').insert([payload]))
    } else {
      ({ error } = await supabase.from('events').update(payload).eq('id', editId))
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(modal === 'create' ? 'Event created successfully' : 'Event updated')
    closeModal()
    fetchEvents()
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Event deleted')
    fetchEvents()
  }

  const toggleFeatured = async (id, current) => {
    const { error } = await supabase.from('events').update({ is_featured: !current }).eq('id', id)
    if (error) { showToast(error.message, 'error'); return }
    setEvents(events.map(e => e.id === id ? { ...e, is_featured: !current } : e))
  }

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || e.category === filterCat
    return matchSearch && matchCat
  })

  const catColor = (c) => ({
    workshop: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    hackathon: 'text-nvidia bg-nvidia/10 border-nvidia/20',
    talk: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    social: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  }[c] ?? 'text-gray-400 bg-white/5 border-white/10')

  return (
    <div className="space-y-6 max-w-6xl">
      <Toast {...toast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Events CMS</h1>
          <p className="text-sm font-mono text-gray-400 mt-1">{events.length} events total</p>
        </div>
        <button
          id="admin-events-add"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nvidia text-black font-display font-bold text-sm hover:bg-nvidia-light transition-colors shadow-nvidia-glow"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['all', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-mono capitalize transition-all ${
                filterCat === cat
                  ? 'bg-nvidia text-black font-bold'
                  : 'bg-bg-secondary border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-secondary border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-500 font-mono text-sm py-16">Loading events...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 font-mono text-sm py-16">No events found.</div>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-400 font-normal px-5 py-3">Title</th>
                <th className="text-left text-gray-400 font-normal px-5 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-gray-400 font-normal px-5 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left text-gray-400 font-normal px-5 py-3">Featured</th>
                <th className="text-left text-gray-400 font-normal px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3 text-white font-semibold max-w-xs truncate">{ev.title}</td>
                  <td className="px-5 py-3 text-gray-400 hidden md:table-cell">
                    {ev.date ? new Date(ev.date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${catColor(ev.category)}`}>
                      {ev.category}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleFeatured(ev.id, ev.is_featured)}
                      title="Toggle featured"
                      className="transition-colors"
                    >
                      {ev.is_featured
                        ? <Star className="w-4 h-4 text-nvidia fill-nvidia" />
                        : <StarOff className="w-4 h-4 text-gray-600 hover:text-gray-400" />
                      }
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(118,185,0,0.15)]">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-display font-bold text-white">
                {modal === 'create' ? 'Create Event' : 'Edit Event'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-nvidia" /> Title *
                </label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. CUDA Workshop #4"
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-nvidia" /> Date *
                  </label>
                  <input required type="datetime-local" value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-nvidia" /> Location
                  </label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. C-Block Auditorium"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
              </div>

              {/* Category & Featured */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-nvidia" /> Category *
                  </label>
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300">Featured</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                      className={`relative w-9 h-5 rounded-full transition-colors ${form.is_featured ? 'bg-nvidia' : 'bg-gray-700'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_featured ? 'translate-x-4' : ''}`} />
                    </button>
                    <span className="text-xs font-mono text-gray-400">{form.is_featured ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-nvidia" /> Image URL (Cloudinary)
                </label>
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300">Description</label>
                <textarea rows={4} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Event details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nvidia text-black font-bold text-xs font-mono hover:bg-nvidia-light transition-colors disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : modal === 'create' ? 'Create Event' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

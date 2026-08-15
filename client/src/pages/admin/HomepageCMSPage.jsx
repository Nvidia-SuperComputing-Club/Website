import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Save, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react'

const SECTIONS = [
  {
    key: 'hero',
    label: 'Hero Section',
    desc: 'Main banner — title, subtitle, and CTA button',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'cta_text', label: 'CTA Button Text', type: 'text' },
      { name: 'cta_link', label: 'CTA Button Link', type: 'text' },
      { name: 'image_url', label: 'Background Image URL', type: 'text' },
    ],
  },
  {
    key: 'about',
    label: 'About Section',
    desc: 'Club description and mission statement',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'body', label: 'Body Text', type: 'textarea' },
      { name: 'image_url', label: 'Image URL', type: 'text' },
    ],
  },
  {
    key: 'stats',
    label: 'Stats Section',
    desc: 'Animated counter stats (members, events, etc.)',
    fields: [
      { name: 'stat1_label', label: 'Stat 1 Label', type: 'text' },
      { name: 'stat1_value', label: 'Stat 1 Value', type: 'text' },
      { name: 'stat2_label', label: 'Stat 2 Label', type: 'text' },
      { name: 'stat2_value', label: 'Stat 2 Value', type: 'text' },
      { name: 'stat3_label', label: 'Stat 3 Label', type: 'text' },
      { name: 'stat3_value', label: 'Stat 3 Value', type: 'text' },
      { name: 'stat4_label', label: 'Stat 4 Label', type: 'text' },
      { name: 'stat4_value', label: 'Stat 4 Value', type: 'text' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    desc: 'Club description and social media links',
    fields: [
      { name: 'description', label: 'Club Description', type: 'textarea' },
      { name: 'discord_url', label: 'Discord URL', type: 'text' },
      { name: 'github_url', label: 'GitHub URL', type: 'text' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
      { name: 'twitter_url', label: 'Twitter/X URL', type: 'text' },
    ],
  },
]

function Toast({ msg, type }) {
  if (!msg) return null
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-mono shadow-lg border ${
      type === 'error'
        ? 'bg-red-900/80 border-red-500/40 text-red-200'
        : 'bg-nvidia/20 border-nvidia/40 text-white'
    }`}>{msg}</div>
  )
}

function SectionCard({ section, initialData, onSave }) {
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const vals = {}
    section.fields.forEach(f => { vals[f.name] = initialData?.[f.name] ?? '' })
    setForm(vals)
  }, [initialData, section])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(section.key, form)
    setSaving(false)
  }

  return (
    <div className="bg-bg-secondary border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/2 transition-colors"
      >
        <div className="text-left">
          <p className="text-sm font-display font-bold text-white">{section.label}</p>
          <p className="text-xs font-mono text-gray-500 mt-0.5">{section.desc}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <form onSubmit={handleSave} className="px-6 pb-6 space-y-4 border-t border-white/10 pt-4">
          {section.fields.map(f => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                {f.name.includes('image') && <ImageIcon className="w-3.5 h-3.5 text-nvidia" />}
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={form[f.name] ?? ''}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={form[f.name] ?? ''}
                  onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nvidia text-black font-bold text-xs font-mono hover:bg-nvidia-light transition-colors disabled:opacity-50 shadow-nvidia-glow"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function HomepageCMSPage() {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const result = await api.get('/homepage')
        const rows = result.data ?? []
        const map = {}
        rows.forEach(r => { map[r.section] = r.body })
        setData(map)
      } catch (err) {
        showToast(err.message, 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleSave = async (section, formData) => {
    try {
      await api.put(`/homepage/${section}`, { body: formData })
      setData(prev => ({ ...prev, [section]: formData }))
      showToast('Content saved')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Toast {...toast} />

      <div>
        <h1 className="text-2xl font-display font-bold text-white">Homepage CMS</h1>
        <p className="text-sm font-mono text-gray-400 mt-1">Edit each section of the public landing page</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 font-mono text-sm py-16">Loading content...</p>
      ) : (
        <div className="space-y-3">
          {SECTIONS.map(section => (
            <SectionCard
              key={section.key}
              section={section}
              initialData={data[section.key]}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  )
}

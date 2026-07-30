import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Plus, Pencil, Trash2, Search, X, Save,
  User, Briefcase, AlignLeft, Image as ImageIcon,
  Github, Linkedin, Twitter, Eye, EyeOff
} from 'lucide-react'

const EMPTY_FORM = {
  name: '', role: '', bio: '', image_url: '',
  github_url: '', linkedin_url: '', twitter_url: '',
  display_order: 0, is_active: true,
}

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

export default function TeamCMSPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) showToast(error.message, 'error')
    else setMembers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchMembers() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (m) => {
    setForm({
      name: m.name, role: m.role, bio: m.bio ?? '',
      image_url: m.image_url ?? '', github_url: m.github_url ?? '',
      linkedin_url: m.linkedin_url ?? '', twitter_url: m.twitter_url ?? '',
      display_order: m.display_order ?? 0, is_active: m.is_active,
    })
    setEditId(m.id)
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, display_order: Number(form.display_order) }
    let error
    if (modal === 'create') {
      ({ error } = await supabase.from('team_members').insert([payload]))
    } else {
      ({ error } = await supabase.from('team_members').update(payload).eq('id', editId))
    }
    setSaving(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast(modal === 'create' ? 'Member added successfully' : 'Member updated')
    closeModal()
    fetchMembers()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the team?`)) return
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Member removed')
    fetchMembers()
  }

  const toggleActive = async (id, current) => {
    const { error } = await supabase.from('team_members').update({ is_active: !current }).eq('id', id)
    if (error) { showToast(error.message, 'error'); return }
    setMembers(members.map(m => m.id === id ? { ...m, is_active: !current } : m))
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <Toast {...toast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Team CMS</h1>
          <p className="text-sm font-mono text-gray-400 mt-1">{members.length} members</p>
        </div>
        <button
          id="admin-team-add"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nvidia text-black font-display font-bold text-sm hover:bg-nvidia-light transition-colors shadow-nvidia-glow"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text" placeholder="Search members..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-gray-500 font-mono text-sm py-16">Loading team...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 font-mono text-sm py-16">No members found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <div key={m.id} className={`bg-bg-secondary border rounded-xl p-5 space-y-3 transition-all ${
              m.is_active ? 'border-white/10' : 'border-white/5 opacity-60'
            }`}>
              <div className="flex items-start gap-3">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="w-12 h-12 rounded-full border-2 border-nvidia/40 object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-nvidia/10 border-2 border-nvidia/30 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-nvidia/60" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-display font-bold text-white truncate">{m.name}</p>
                  <p className="text-xs font-mono text-nvidia truncate">{m.role}</p>
                  <p className="text-[10px] font-mono text-gray-500">Order: {m.display_order}</p>
                </div>
              </div>
              {m.bio && <p className="text-xs text-gray-400 font-sans line-clamp-2">{m.bio}</p>}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <button onClick={() => openEdit(m)} title="Edit"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleActive(m.id, m.is_active)} title={m.is_active ? 'Hide' : 'Show'}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-nvidia hover:bg-nvidia/10 transition-all">
                  {m.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(m.id, m.name)} title="Remove"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className={`ml-auto text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                  m.is_active
                    ? 'text-nvidia bg-nvidia/10 border-nvidia/20'
                    : 'text-gray-500 bg-white/5 border-white/10'
                }`}>
                  {m.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(118,185,0,0.15)]">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-display font-bold text-white">
                {modal === 'create' ? 'Add Team Member' : 'Edit Member'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-nvidia" /> Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-nvidia" /> Role *</label>
                  <input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    placeholder="e.g. President"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-nvidia" /> Photo URL (Cloudinary)</label>
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5"><AlignLeft className="w-3.5 h-3.5 text-nvidia" /> Bio</label>
                <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Short bio..."
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1"><Github className="w-3 h-3 text-nvidia" /> GitHub</label>
                  <input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1"><Linkedin className="w-3 h-3 text-nvidia" /> LinkedIn</label>
                  <input value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300 flex items-center gap-1"><Twitter className="w-3 h-3 text-nvidia" /> Twitter</label>
                  <input value={form.twitter_url} onChange={e => setForm({ ...form, twitter_url: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300">Display Order</label>
                  <input type="number" min={0} value={form.display_order}
                    onChange={e => setForm({ ...form, display_order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-300">Visible on Site</label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10">
                    <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className={`relative w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-nvidia' : 'bg-gray-700'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-4' : ''}`} />
                    </button>
                    <span className="text-xs font-mono text-gray-400">{form.is_active ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nvidia text-black font-bold text-xs font-mono hover:bg-nvidia-light transition-colors disabled:opacity-50">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : modal === 'create' ? 'Create Member' : 'Update Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

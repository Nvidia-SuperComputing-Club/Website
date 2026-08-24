import { useState, useEffect } from 'react'
import { teamService } from '../../services/supabaseService.js'
import MemberForm from '../../components/admin/MemberForm.jsx'
import {
  Plus, Pencil, Trash2, Search, X,
  User, Eye, EyeOff, LayoutGrid, Table
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
  const [viewMode, setViewMode] = useState('grid')
  const [draggedIdx, setDraggedIdx] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000)
  }

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const data = await teamService.getTeamMembers()
      setMembers(data || [])
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
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
    setEditId(m.id || m._id)
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); setEditId(null) }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, display_order: Number(form.display_order) }
      if (modal === 'create') {
        await teamService.createTeamMember(payload)
        showToast('Member added successfully')
      } else {
        await teamService.updateTeamMember(editId, payload)
        showToast('Member updated')
      }
      closeModal()
      fetchMembers()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the team? (This will hide them from the public page)`)) return
    try {
      await teamService.deleteTeamMember(id)
      showToast('Member removed (soft-deleted)')
      fetchMembers()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const toggleActive = async (id, current) => {
    try {
      await teamService.updateTeamMember(id, { is_active: !current })
      setMembers(members.map(m => (m.id || m._id) === id ? { ...m, is_active: !current } : m))
      showToast(!current ? 'Member is now visible' : 'Member is now hidden')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedIdx(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
  }

  const handleDrop = async (e, index) => {
    e.preventDefault()
    if (draggedIdx === null || draggedIdx === index) return

    const newMembers = [...members]
    const [draggedItem] = newMembers.splice(draggedIdx, 1)
    newMembers.splice(index, 0, draggedItem)

    setMembers(newMembers)

    const updates = newMembers.map((m, idx) => ({
      ...m,
      display_order: idx + 1
    }))

    try {
      await Promise.all(updates.map(m => teamService.updateTeamMember(m.id || m._id, { display_order: m.display_order })))
      showToast('Display order updated successfully')
    } catch (err) {
      showToast('Failed to save display order: ' + err.message, 'error')
      fetchMembers()
    }
  }

  const handleDragEnd = () => {
    setDraggedIdx(null)
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

      {/* Controls: Search and Layout Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text" placeholder="Search members..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>

        <div className="flex bg-obsidian-950 p-1 rounded-xl border border-white/5 shrink-0 self-start sm:self-center">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid view"
            className={`p-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-nvidia text-black shadow-nvidia-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table view"
            className={`p-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-nvidia text-black shadow-nvidia-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <p className="text-center text-gray-500 font-mono text-sm py-16">Loading team...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 font-mono text-sm py-16">No members found.</p>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m, idx) => (
            <div
              key={m.id || m._id}
              draggable
              onDragStart={e => handleDragStart(e, idx)}
              onDragOver={e => handleDragOver(e, idx)}
              onDrop={e => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              className={`bg-bg-secondary border rounded-xl p-5 space-y-3 transition-all cursor-move ${
                m.is_active ? 'border-white/10 hover:border-nvidia/40' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                {m.image_url ? (
                  <img
                    src={m.image_url}
                    alt={m.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full border-2 border-nvidia/40 object-cover shrink-0"
                  />
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
              {m.bio && <p className="text-xs text-gray-400 font-sans line-clamp-2 leading-relaxed">{m.bio}</p>}

              <div className="flex items-center gap-2 pt-2.5 border-t border-white/5">
                <button onClick={() => openEdit(m)} title="Edit"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => toggleActive(m.id || m._id, m.is_active)} title={m.is_active ? 'Hide' : 'Show'}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-nvidia hover:bg-nvidia/10 transition-all">
                  {m.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => handleDelete(m.id || m._id, m.name)} title="Remove"
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
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-bg-secondary">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-bg-tertiary text-gray-400 font-bold">
                <th className="p-4 w-16">Order</th>
                <th className="p-4 w-16">Photo</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Bio</th>
                <th className="p-4 w-28">Status</th>
                <th className="p-4 w-32 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, idx) => (
                <tr
                  key={m.id || m._id}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDrop={e => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-move ${
                    m.is_active ? '' : 'opacity-60 bg-white/[0.01]'
                  }`}
                >
                  <td className="p-4 font-bold text-nvidia font-mono">{m.display_order}</td>
                  <td className="p-4">
                    {m.image_url ? (
                      <img
                        src={m.image_url}
                        alt={m.name}
                        className="w-8 h-8 rounded-full border border-nvidia/30 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-nvidia/10 border border-nvidia/30 flex items-center justify-center">
                        <User className="w-4 h-4 text-nvidia/50" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-display font-bold text-white text-sm">{m.name}</td>
                  <td className="p-4 text-gray-300">{m.role}</td>
                  <td className="p-4 text-gray-400 font-sans max-w-xs truncate">{m.bio || '-'}</td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      m.is_active
                        ? 'text-nvidia bg-nvidia/10 border-nvidia/20'
                        : 'text-gray-500 bg-white/5 border-white/10'
                    }`}>
                      {m.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openEdit(m)} title="Edit"
                        className="p-1.5 rounded bg-obsidian-950 border border-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleActive(m.id || m._id, m.is_active)} title={m.is_active ? 'Hide' : 'Show'}
                        className="p-1.5 rounded bg-obsidian-950 border border-white/5 text-gray-400 hover:text-nvidia hover:border-nvidia/30 transition-all">
                        {m.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleDelete(m.id || m._id, m.name)} title="Remove"
                        className="p-1.5 rounded bg-obsidian-950 border border-white/5 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

            <MemberForm
              form={form}
              setForm={setForm}
              onSubmit={handleSave}
              onCancel={closeModal}
              saving={saving}
              modalMode={modal}
            />
          </div>
        </div>
      )}
    </div>
  )
}

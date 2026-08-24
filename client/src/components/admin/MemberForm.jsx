import React, { useRef, useState } from 'react'
import {
  User, Briefcase, AlignLeft, Image as ImageIcon,
  Github, Linkedin, Twitter, Save, Upload, X
} from 'lucide-react'

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 250
        const MAX_HEIGHT = 250
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL('image/webp', 0.8)
        resolve(dataUrl)
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}

export default function MemberForm({ form, setForm, onSubmit, onCancel, saving, modalMode }) {
  const fileInputRef = useRef(null)
  const [compressing, setCompressing] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image exceeds the 5MB size limit.')
      return
    }

    setUploadError('')
    setCompressing(true)

    try {
      const compressedWebP = await compressImage(file)
      setUploading(true)
      const { uploadToCloudinary } = await import('../../services/cloudinary.js')
      const result = await uploadToCloudinary(compressedWebP, 'team')
      setForm(prev => ({ ...prev, image_url: result.url }))
    } catch (err) {
      console.error('Image upload failed:', err)
      setUploadError('Failed to upload image. Try another file or paste a URL directly.')
    } finally {
      setCompressing(false)
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const removePhoto = () => {
    setForm(prev => ({ ...prev, image_url: '' }))
  }

  return (
    <form onSubmit={onSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-nvidia" /> Name *
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Full Name"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-nvidia" /> Role *
          </label>
          <input
            required
            type="text"
            value={form.role}
            onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g. President"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-nvidia" /> Profile Photo
        </label>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-tertiary border border-white/10">
          <div className="relative w-16 h-16 rounded-xl bg-obsidian-950 border border-nvidia/30 flex items-center justify-center overflow-hidden shrink-0">
            {form.image_url ? (
              <>
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-0.5 right-0.5 p-0.5 rounded-md bg-black/70 text-gray-300 hover:text-white"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <User className="w-8 h-8 text-nvidia/40" />
            )}
          </div>

          <div className="flex-1 space-y-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={compressing || uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-white text-[11px] font-mono hover:border-nvidia transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-nvidia" />
              {compressing ? 'Compressing...' : uploading ? 'Uploading...' : 'Choose Image'}
            </button>
            <p className="text-[10px] text-gray-500 font-mono">
              Accepts PNG/JPG/WebP up to 5MB. Auto-compressed and uploaded.
            </p>
            {uploadError && <p className="text-[10px] text-red-400 font-mono">{uploadError}</p>}
          </div>
        </div>

        <input
          type="text"
          value={form.image_url}
          onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
          placeholder="Or paste direct image URL"
          className="w-full px-4 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-[10px] font-mono focus:outline-none focus:border-nvidia transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-nvidia" /> Bio
        </label>
        <textarea
          rows={3}
          value={form.bio}
          onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Short bio..."
          className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 flex items-center gap-1">
            <Github className="w-3 h-3 text-nvidia" /> GitHub
          </label>
          <input
            type="url"
            value={form.github_url}
            onChange={e => setForm(prev => ({ ...prev, github_url: e.target.value }))}
            placeholder="https://github.com/..."
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-[10px] font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 flex items-center gap-1">
            <Linkedin className="w-3 h-3 text-nvidia" /> LinkedIn
          </label>
          <input
            type="url"
            value={form.linkedin_url}
            onChange={e => setForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
            placeholder="https://linkedin.com/..."
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-[10px] font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 flex items-center gap-1">
            <Twitter className="w-3 h-3 text-nvidia" /> Twitter
          </label>
          <input
            type="url"
            value={form.twitter_url}
            onChange={e => setForm(prev => ({ ...prev, twitter_url: e.target.value }))}
            placeholder="https://x.com/..."
            className="w-full px-3 py-2 rounded-xl bg-bg-tertiary border border-white/10 text-white text-[10px] font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300">Display Order</label>
          <input
            type="number"
            min={0}
            value={form.display_order}
            onChange={e => setForm(prev => ({ ...prev, display_order: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-nvidia transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300">Visible on Site</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-tertiary border border-white/10">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, is_active: !prev.is_active }))}
              className={`relative w-9 h-5 rounded-full transition-colors ${form.is_active ? 'bg-nvidia' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-4' : ''}`} />
            </button>
            <span className="text-xs font-mono text-gray-400">{form.is_active ? 'Active' : 'Hidden'}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl bg-bg-tertiary border border-white/10 text-xs font-mono text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || compressing || uploading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nvidia text-black font-bold text-xs font-mono hover:bg-nvidia-light transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : modalMode === 'create' ? 'Create Member' : 'Update Member'}
        </button>
      </div>
    </form>
  )
}

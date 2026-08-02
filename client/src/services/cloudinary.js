/**
 * cloudinary.js
 * Client-side Cloudinary upload service using an unsigned upload preset.
 * No API secret is required — the preset handles security restrictions.
 *
 * Cloudinary Dashboard → Settings → Upload → Upload Presets → Add Unsigned preset
 * Restrict allowed formats and max file size in the preset settings.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

/**
 * Validates the file before uploading.
 * @param {File} file
 * @throws {Error} with a user-facing message
 */
export function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type "${file.type}". Allowed: JPG, JPEG, PNG, WEBP.`)
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size: 5MB.`)
  }
}

/**
 * Uploads an image file to Cloudinary.
 * @param {File} file - The image file to upload
 * @param {'events'|'team'|'homepage'} folder - Destination folder in Cloudinary
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, folder = 'homepage') {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    )
  }

  // Client-side validation before hitting the network
  validateImageFile(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Upload failed with status ${response.status}.`)
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
  }
}

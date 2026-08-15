/**
 * cloudinary.js
 * Client-side upload service that uses the backend /api/upload endpoint.
 * Images are uploaded to Cloudinary via the server, keeping credentials secure.
 */

export async function uploadToCloudinary(file, folder = 'homepage') {
  const token = localStorage.getItem('nvidia_sc_token');
  if (!token) {
    throw new Error('You must be logged in as an admin to upload images.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Upload failed with status ${response.status}.`)
  }

  const data = await response.json()
  return {
    url: data.data.url,
    publicId: data.data.path
  }
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadToCloudinary } from '../services/cloudinary.js';

describe('Cloudinary Upload Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should throw an error if no admin token is stored', async () => {
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    await expect(uploadToCloudinary(file)).rejects.toThrow(
      'You must be logged in as an admin to upload images.'
    );
  });

  it('should upload image successfully when admin token is present', async () => {
    localStorage.setItem('nvidia_sc_token', 'mock-admin-token');

    const mockResponseData = {
      success: true,
      data: {
        url: 'https://res.cloudinary.com/demo/image/upload/v1234/test.png',
        path: 'nvidia-sc/homepage/test_public_id',
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponseData),
    });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = await uploadToCloudinary(file, 'events');

    expect(global.fetch).toHaveBeenCalled();
    const fetchArgs = global.fetch.mock.calls[0];
    expect(fetchArgs[0]).toContain('/upload');
    expect(fetchArgs[1].headers.Authorization).toBe('Bearer mock-admin-token');
    expect(result).toEqual({
      url: mockResponseData.data.url,
      publicId: mockResponseData.data.path,
    });
  });

  it('should throw an error if backend upload returns a non-200 status', async () => {
    localStorage.setItem('nvidia_sc_token', 'mock-admin-token');

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({
        error: { message: 'Invalid image format' },
      }),
    });

    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    await expect(uploadToCloudinary(file)).rejects.toThrow('Invalid image format');
  });
});

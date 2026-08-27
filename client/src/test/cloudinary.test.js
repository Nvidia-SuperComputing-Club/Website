import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadToCloudinary } from '../services/cloudinary.js';

describe('Cloudinary Upload Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should throw an error if Cloudinary env variables are missing', async () => {
    vi.stubEnv('VITE_CLOUDINARY_CLOUD_NAME', '');
    vi.stubEnv('VITE_CLOUDINARY_API_KEY', '');
    vi.stubEnv('VITE_CLOUDINARY_API_SECRET', '');

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    await expect(uploadToCloudinary(file)).rejects.toThrow(
      'Cloudinary environment variables are missing'
    );
  });

  it('should upload image successfully when env variables are configured', async () => {
    vi.stubEnv('VITE_CLOUDINARY_CLOUD_NAME', 'test-cloud');
    vi.stubEnv('VITE_CLOUDINARY_API_KEY', 'test-key');
    vi.stubEnv('VITE_CLOUDINARY_API_SECRET', 'test-secret');

    const mockResponseData = {
      secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/v1234/test.png',
      public_id: 'homepage/test_public_id',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponseData),
    });

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = await uploadToCloudinary(file, 'events');

    expect(global.fetch).toHaveBeenCalled();
    const fetchArgs = global.fetch.mock.calls[0];
    expect(fetchArgs[0]).toContain('https://api.cloudinary.com/v1_1/test-cloud/image/upload');
    expect(result).toEqual({
      url: mockResponseData.secure_url,
      publicId: mockResponseData.public_id,
    });
  });

  it('should throw an error if Cloudinary returns an error status', async () => {
    vi.stubEnv('VITE_CLOUDINARY_CLOUD_NAME', 'test-cloud');
    vi.stubEnv('VITE_CLOUDINARY_API_KEY', 'test-key');
    vi.stubEnv('VITE_CLOUDINARY_API_SECRET', 'test-secret');

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

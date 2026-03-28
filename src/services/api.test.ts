import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from './api';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

// Mock the auth store
vi.mock('../stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

describe('API Interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add Authorization header if token exists in auth store', async () => {
    const mockToken = 'mock-test-token';
    // Set up the mock state with a token
    (useAuthStore.getState as any).mockReturnValue({ token: mockToken });

    // Mock axios adapter to intercept the request and prevent an actual network call
    const adapter = vi.fn().mockResolvedValue({
      data: 'mock data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    // Assign the mock adapter to the api instance
    api.defaults.adapter = adapter;

    await api.get('/test-endpoint');

    expect(adapter).toHaveBeenCalledTimes(1);

    // The adapter receives the config object as its first argument
    const reqConfig = adapter.mock.calls[0][0];

    // Verify the Authorization header was correctly set
    expect(reqConfig.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should not add Authorization header if no token exists in auth store', async () => {
    // Set up the mock state without a token
    (useAuthStore.getState as any).mockReturnValue({ token: null });

    // Mock axios adapter to intercept the request
    const adapter = vi.fn().mockResolvedValue({
      data: 'mock data',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    });

    api.defaults.adapter = adapter;

    await api.get('/test-endpoint');

    expect(adapter).toHaveBeenCalledTimes(1);

    const reqConfig = adapter.mock.calls[0][0];

    // Verify the Authorization header is undefined
    expect(reqConfig.headers.Authorization).toBeUndefined();
  });
});

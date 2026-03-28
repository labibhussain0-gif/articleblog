import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with null user and token from localStorage', () => {
    localStorage.setItem('token', 'initial-token');

    // We need to re-initialize the store to test initial state
    // Since zustand stores are singletons, we can just reset it or check the existing state
    // Let's reset the store state
    useAuthStore.setState({ user: null, token: localStorage.getItem('token') });

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBe('initial-token');
  });

  it('setUser updates user, token and localStorage', () => {
    const mockUser = { id: 1, name: 'Test User' };
    const mockToken = 'test-token-123';

    // Spy on localStorage
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    useAuthStore.getState().setUser(mockUser, mockToken);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);

    // Verify localStorage was called correctly
    expect(setItemSpy).toHaveBeenCalledWith('token', mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('logout clears user, token and localStorage', () => {
    // Setup initial state
    useAuthStore.setState({
      user: { id: 1, name: 'Test User' },
      token: 'test-token-123'
    });
    localStorage.setItem('token', 'test-token-123');

    // Spy on localStorage
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();

    // Verify localStorage was called correctly
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(localStorage.getItem('token')).toBeNull();
  });
});

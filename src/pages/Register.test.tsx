import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import api from '../services/api';

// Mock the API and auth store
vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({
    setUser: vi.fn(),
  }),
}));

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const renderRegister = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it('shows an alert when registration fails', async () => {
    // Mock api.post to reject
    const mockPost = api.post as any;
    mockPost.mockRejectedValue(new Error('API Error'));

    const user = userEvent.setup();
    renderRegister();

    // Fill out the form by selecting elements by label text, which now works because of htmlFor/id pair
    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for the alert to be called
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration failed');
    });
  });
});

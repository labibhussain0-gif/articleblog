import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CreateArticle from './CreateArticle';
import api from '../services/api';
import * as router from 'react-router-dom';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn()
  }
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('CreateArticle Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    (router.useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CreateArticle />
      </BrowserRouter>
    );
  };

  it('handles API failure correctly', async () => {
    // Setup API to reject
    const mockError = new Error('Network error');
    (api.post as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

    renderComponent();

    // Fill out the required form fields
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Title'), 'My Awesome Article');
    await user.type(screen.getByPlaceholderText(/Write your article content here/i), 'This is the content of my awesome article that should be long enough to pass validation.');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /Save Article/i }));

    // Verify error handling
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    expect(window.alert).toHaveBeenCalledWith('Failed to create article');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles API success correctly', async () => {
    // Setup API to succeed
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { slug: 'my-awesome-article' } });

    renderComponent();

    // Fill out the required form fields
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('Title'), 'My Awesome Article');
    await user.type(screen.getByPlaceholderText(/Write your article content here/i), 'This is the content of my awesome article that should be long enough to pass validation.');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /Save Article/i }));

    // Verify success handling
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    expect(window.alert).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/article/my-awesome-article');
  });
});

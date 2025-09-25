import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { 
    ...actual, 
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  const mockOnLoginSuccess = vi.fn();
  const fetchMock = vi.fn();

  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockClear();
    (window as any).fetch = fetchMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login onLoginSuccess={mockOnLoginSuccess} />
      </BrowserRouter>
    );
  };

  describe('Component Rendering', () => {
    test('renders login form with all elements', () => {
      renderLogin();

      expect(screen.getByTestId('login-title')).toBeInTheDocument();
      expect(screen.getByText('Customer Login')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    test('login button is disabled when form is empty', () => {
      renderLogin();

      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeDisabled();
    });

    test('login button is enabled when both fields are filled', async () => {
      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'password' } });

      expect(loginButton).not.toBeDisabled();
    });
  });

  describe('Form Validation and Submission', () => {
    test('successful login with valid credentials', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCustomers)
      });

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledWith({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('failed login with invalid credentials', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCustomers)
      });

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
        expect(screen.getByText('Invalid email or password. Please check your credentials and try again.')).toBeInTheDocument();
      });

      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });

    test('handles network error gracefully', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
        expect(screen.getByText('Unable to login. Please check your connection and try again.')).toBeInTheDocument();
      });
    });

    test('handles server error response', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
        expect(screen.getByText('Unable to login. Please check your connection and try again.')).toBeInTheDocument();
      });
    });

    test('email comparison is case insensitive', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCustomers)
      });

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'JOHN@EXAMPLE.COM' } });
      fireEvent.change(passwordInput!, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalledWith({
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        });
      });
    });
  });

  describe('Loading States', () => {
    test('shows loading state during login attempt', async () => {
      fetchMock.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve(mockCustomers)
      }), 100)));

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      fireEvent.change(emailInput!, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      // Should show loading state
      expect(screen.getByText('Logging in...')).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });

    test('clears error when user starts typing', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCustomers)
      });

      renderLogin();

      const emailInput = screen.getByTestId('email-input').querySelector('input');
      const passwordInput = screen.getByTestId('password-input').querySelector('input');
      const loginButton = screen.getByTestId('login-button');

      // Trigger error first
      fireEvent.change(emailInput!, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput!, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('login-error')).toBeInTheDocument();
      });

      // Start typing should clear error
      fireEvent.change(emailInput!, { target: { value: 'john@example.com' } });
      
      expect(screen.queryByTestId('login-error')).not.toBeInTheDocument();
    });
  });
});

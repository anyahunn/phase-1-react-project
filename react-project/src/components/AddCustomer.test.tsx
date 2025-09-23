import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddCustomer from './AddCustomer';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

describe('AddCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    // Setup fetch mock
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }));
  });

  it('renders the form and cancel button', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('allows user to type in all fields', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p@ss4' } });
    expect(screen.getByLabelText(/name/i)).toHaveValue('Dana');
    expect(screen.getByLabelText(/email/i)).toHaveValue('dana@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('p@ss4');
  });

  it('calls fetch with correct data and navigates on submit', async () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p@ss4' } });
    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:4000/customers',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Dana',
            email: 'dana@example.com',
            password: 'p@ss4',
          }),
        }
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('navigates back when cancel is clicked', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

/*import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddCustomer from './AddCustomer';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch
const mockFetch = vi.fn();
(globalThis as any).fetch = mockFetch;

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

describe('AddCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });

  it('renders the form and cancel button', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('allows user to type in all fields', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p@ss4' } });
    expect(screen.getByLabelText(/name/i)).toHaveValue('Dana');
    expect(screen.getByLabelText(/email/i)).toHaveValue('dana@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('p@ss4');
  });

  it('calls fetch with correct data and navigates on submit', async () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p@ss4' } });
    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:4000/customers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Dana',
          email: 'dana@example.com',
          password: 'p@ss4',
        }),
      }
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when cancel is clicked', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});*/
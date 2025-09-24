import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteCustomer from './DeleteCustomer';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate and useParams
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(),
  };
});

// Import the mocked modules to access the mock functions
import { useNavigate, useParams } from 'react-router-dom';

describe('DeleteCustomer Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    // Reset fetch mock
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders customer details when customer is found', async () => {
    const mockCustomer = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    
    // Mock fetch to return customer data
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockCustomer),
    } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Delete Customer')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('password123')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/customers/1');
  });

  it('renders customer not found message when customer does not exist', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    
    // Mock fetch to return null/undefined for not found customer
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(null),
    } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Customer not found')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:4000/customers/999');
  });

  it('calls fetch with correct customer ID on mount', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '5' });
    
    // Mock fetch to return null for customer not found
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(null),
    } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/customers/5');
    });
  });

  it('calls DELETE API and navigates on confirm delete', async () => {
    const mockCustomer = {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'secret456'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    
    // Mock fetch for initial GET request
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomer),
      } as Response)
      // Mock fetch for DELETE request
      .mockResolvedValueOnce({
        ok: true,
      } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/customers/1', { method: 'DELETE' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('navigates back when cancel is clicked', async () => {
    const mockCustomer = {
      id: 1,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: 'mypassword'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    
    // Mock fetch to return customer data
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(mockCustomer),
    } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when back button is clicked in not found scenario', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    
    // Mock fetch to return null for customer not found
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(null),
    } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles string ID parameter correctly', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '42' });
    
    // Mock fetch to return null for customer not found
    vi.mocked(fetch).mockResolvedValueOnce({
      json: () => Promise.resolve(null),
    } as Response);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:4000/customers/42');
    });
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpdateCustomer from './UpdateCustomer';
import { MemoryRouter } from 'react-router-dom';

// Mock memdb
vi.mock('../../../ProjectAssets/memdb.js', () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

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
import * as memdb from '../../../ProjectAssets/memdb.js';
import { useNavigate, useParams } from 'react-router-dom';

describe('UpdateCustomer Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders the form with empty fields when customer is not found', () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    
    // Check that fields are empty
    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
  });

  it('renders the form with existing customer data when customer is found', async () => {
    const existingCustomer = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(existingCustomer);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    // Wait for useEffect to populate the form
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    });
  });

  it('calls memdb.get with correct customer ID on mount', () => {
    vi.mocked(useParams).mockReturnValue({ id: '5' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    expect(vi.mocked(memdb.get)).toHaveBeenCalledWith(5);
  });

  it('allows user to type in all fields', async () => {
    const existingCustomer = {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'oldpassword'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(existingCustomer);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('Jane Smith');
    });

    // Update the fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Updated' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane.updated@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('Jane Updated');
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane.updated@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('newpassword');
  });

  it('calls memdb.put and navigates on form submission', async () => {
    const existingCustomer = {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: 'bobpass'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '2' });
    vi.mocked(memdb.get).mockReturnValue(existingCustomer);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('Bob Wilson');
    });

    // Update the fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bob Updated' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob.updated@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newbobpass' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));

    expect(vi.mocked(memdb.put)).toHaveBeenCalledWith(2, {
      id: 2,
      name: 'Bob Updated',
      email: 'bob.updated@example.com',
      password: 'newbobpass'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when cancel is clicked', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('prevents form submission with empty required fields', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    // Try to submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));

    // memdb.put should not be called
    expect(vi.mocked(memdb.put)).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles string ID parameter correctly', () => {
    vi.mocked(useParams).mockReturnValue({ id: '42' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    expect(vi.mocked(memdb.get)).toHaveBeenCalledWith(42);
  });

  it('preserves customer ID when updating', async () => {
    const existingCustomer = {
      id: 7,
      name: 'Alice Brown',
      email: 'alice@example.com',
      password: 'alicepass'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '7' });
    vi.mocked(memdb.get).mockReturnValue(existingCustomer);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('Alice Brown');
    });

    // Update only the name
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice Updated' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));

    // Check that the ID is preserved
    expect(vi.mocked(memdb.put)).toHaveBeenCalledWith(7, {
      id: 7,
      name: 'Alice Updated',
      email: 'alice@example.com',
      password: 'alicepass'
    });
  });
});
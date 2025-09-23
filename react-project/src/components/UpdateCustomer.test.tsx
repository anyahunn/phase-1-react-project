import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UpdateCustomer from './UpdateCustomer';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../ProjectAssets/memdb.js', () => ({
  get: vi.fn(),
  put: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(),
  };
});

import * as memdb from '../../../ProjectAssets/memdb.js';
import { useNavigate, useParams } from 'react-router-dom';

describe('UpdateCustomer Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders form with empty fields when customer is not found', () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <UpdateCustomer />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('');
    expect(screen.getByLabelText(/email/i)).toHaveValue('');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders form with existing customer data and handles input changes', async () => {
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

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Updated' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.updated@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Updated');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john.updated@example.com');
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

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('Bob Wilson');
    });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Bob Updated' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'bob.updated@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newbobpass' } });

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

    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));

    expect(vi.mocked(memdb.put)).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles string ID parameter correctly and preserves ID', async () => {
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

    expect(vi.mocked(memdb.get)).toHaveBeenCalledWith(7);

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('Alice Brown');
    });

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Alice Updated' } });

    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));

    expect(vi.mocked(memdb.put)).toHaveBeenCalledWith(7, {
      id: 7,
      name: 'Alice Updated',
      email: 'alice@example.com',
      password: 'alicepass'
    });
  });
});
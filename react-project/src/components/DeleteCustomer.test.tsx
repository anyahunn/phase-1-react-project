import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteCustomer from './DeleteCustomer';
import { MemoryRouter } from 'react-router-dom';

// Mock memdb
vi.mock('../../../ProjectAssets/memdb.js', () => ({
  get: vi.fn(),
  deleteById: vi.fn(),
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

describe('DeleteCustomer Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders customer details when customer is found', () => {
    const mockCustomer = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('password123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders customer not found message when customer does not exist', () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    expect(screen.getByText('Customer not found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('calls memdb.get with correct customer ID on mount', () => {
    vi.mocked(useParams).mockReturnValue({ id: '5' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    expect(vi.mocked(memdb.get)).toHaveBeenCalledWith(5);
  });

  it('calls deleteById and navigates on confirm delete', () => {
    const mockCustomer = {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'secret456'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    expect(vi.mocked(memdb.deleteById)).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when cancel is clicked', () => {
    const mockCustomer = {
      id: 1,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      password: 'mypassword'
    };
    
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when back button is clicked in not found scenario', () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles string ID parameter correctly', () => {
    vi.mocked(useParams).mockReturnValue({ id: '42' });
    vi.mocked(memdb.get).mockReturnValue(null);

    render(
      <MemoryRouter>
        <DeleteCustomer />
      </MemoryRouter>
    );

    expect(vi.mocked(memdb.get)).toHaveBeenCalledWith(42);
  });
});
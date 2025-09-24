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

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: vi.fn(),
  };
});

import * as memdb from '../../../ProjectAssets/memdb.js';
import { useParams } from 'react-router-dom';

const mockCustomer = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('DeleteCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    vi.mocked(memdb.get).mockReset();
    vi.mocked(memdb.deleteById).mockReset();
  });

  it('renders customer details when customer is found', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    renderWithRouter(<DeleteCustomer />);

    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('password123')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders customer not found when customer does not exist', () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    vi.mocked(memdb.get).mockReturnValue(null);

    renderWithRouter(<DeleteCustomer />);

    expect(screen.getByText('Customer not found')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.queryByText('Delete Customer')).not.toBeInTheDocument();
  });

  it('calls memdb.get with correct customer ID on mount', () => {
    vi.mocked(useParams).mockReturnValue({ id: '5' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    renderWithRouter(<DeleteCustomer />);

    expect(memdb.get).toHaveBeenCalledWith(5);
  });

  it('deletes customer and navigates when confirm delete is clicked', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    renderWithRouter(<DeleteCustomer />);

    const confirmButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmButton);

    expect(memdb.deleteById).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when cancel button is clicked', () => {
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    vi.mocked(memdb.get).mockReturnValue(mockCustomer);

    renderWithRouter(<DeleteCustomer />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(memdb.deleteById).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when back button is clicked on customer not found', () => {
    vi.mocked(useParams).mockReturnValue({ id: '999' });
    vi.mocked(memdb.get).mockReturnValue(null);

    renderWithRouter(<DeleteCustomer />);

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles string ID parameter correctly', () => {
    vi.mocked(useParams).mockReturnValue({ id: '42' });
    vi.mocked(memdb.get).mockReturnValue({
      id: 42,
      name: 'Test Customer',
      email: 'test@example.com',
      password: 'testpass'
    });

    renderWithRouter(<DeleteCustomer />);

    expect(memdb.get).toHaveBeenCalledWith(42);
    
    const confirmButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmButton);

    expect(memdb.deleteById).toHaveBeenCalledWith(42);
  });

  it('renders not found message and back button', () => {
    vi.mocked(useParams).mockReturnValue({ id: '123' });
    vi.mocked(memdb.get).mockReturnValue(null);

    renderWithRouter(<DeleteCustomer />);

    expect(screen.getByText('Customer not found')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
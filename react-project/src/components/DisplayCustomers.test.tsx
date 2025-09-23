import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DisplayCustomers from './DisplayCustomers';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../ProjectAssets/memdb.js', () => ({
  getAll: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(),
  };
});

import { getAll } from '../../../ProjectAssets/memdb.js';
import { useNavigate } from 'react-router-dom';

describe('DisplayCustomers Component', () => {
  const mockNavigate = vi.fn();
  
  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'secret456' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', password: 'mypassword' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders customer list with all customers', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('renders empty table when no customers exist', () => {
    vi.mocked(getAll).mockReturnValue([]);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles customer selection and shows correct buttons', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    const johnRow = screen.getByText('John Doe').closest('tr');
    const janeRow = screen.getByText('Jane Smith').closest('tr');
    
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(johnRow).not.toHaveClass('selected-row');

    fireEvent.click(screen.getByText('John Doe'));
    expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    expect(johnRow).toHaveClass('selected-row');

    fireEvent.click(screen.getByText('Jane Smith'));
    expect(johnRow).not.toHaveClass('selected-row');
    expect(janeRow).toHaveClass('selected-row');

    fireEvent.click(screen.getByText('Jane Smith'));
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(janeRow).not.toHaveClass('selected-row');
  });

  it('enables/disables delete button based on selection', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole('button', { name: /delete customer/i });

    expect(deleteButton).toBeDisabled();

    fireEvent.click(screen.getByText('John Doe'));
    expect(deleteButton).not.toBeDisabled();

    fireEvent.click(screen.getByText('John Doe'));
    expect(deleteButton).toBeDisabled();
  });

  it('navigates correctly for add, update, and delete actions', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/add_customer/4');

    mockNavigate.mockClear();

    fireEvent.click(screen.getByText('Jane Smith'));
    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/update_customer/2');

    mockNavigate.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /delete customer/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/delete_customer/2');
  });

  it('calculates correct next ID for new customer', () => {
    const fiveCustomers = [
      ...mockCustomers,
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', password: 'alicepass' },
      { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', password: 'charliepass' }
    ];
    
    vi.mocked(getAll).mockReturnValue(fiveCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/add_customer/6');
  });

  it('handles empty customer list for add navigation', () => {
    vi.mocked(getAll).mockReturnValue([]);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/add_customer/1');
  });
});
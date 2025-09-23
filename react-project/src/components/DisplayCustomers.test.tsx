import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DisplayCustomers from './DisplayCustomers';
import { MemoryRouter } from 'react-router-dom';

// Mock memdb
vi.mock('../../../ProjectAssets/memdb.js', () => ({
  getAll: vi.fn(),
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
    
    // Check table headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();

    // Check customer data
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
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    
    // Should not have any customer data
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('calls getAll with "customers" parameter on mount', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    expect(vi.mocked(getAll)).toHaveBeenCalledWith('customers');
  });

  it('shows "Add Customer" button text when no customer is selected', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete customer/i })).toBeInTheDocument();
  });

  it('shows "Update Customer" button text when a customer is selected', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    // Click on the first customer row
    fireEvent.click(screen.getByText('John Doe'));

    expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete customer/i })).toBeInTheDocument();
  });

  it('allows selecting and deselecting customers', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    const johnRow = screen.getByText('John Doe').closest('tr');
    
    // Initially no customer selected
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(johnRow).not.toHaveClass('selected-row');

    // Select customer
    fireEvent.click(screen.getByText('John Doe'));
    expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    expect(johnRow).toHaveClass('selected-row');

    // Deselect customer
    fireEvent.click(screen.getByText('John Doe'));
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(johnRow).not.toHaveClass('selected-row');
  });

  it('enables delete button only when customer is selected', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    const deleteButton = screen.getByRole('button', { name: /delete customer/i });

    // Initially disabled
    expect(deleteButton).toBeDisabled();

    // Select customer - should enable delete button
    fireEvent.click(screen.getByText('John Doe'));
    expect(deleteButton).not.toBeDisabled();

    // Deselect customer - should disable delete button again
    fireEvent.click(screen.getByText('John Doe'));
    expect(deleteButton).toBeDisabled();
  });

  it('navigates to add customer page when add button clicked with no selection', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    
    // Should navigate to add customer with next available ID (customers.length + 1)
    expect(mockNavigate).toHaveBeenCalledWith('/add_customer/4');
  });

  it('navigates to update customer page when update button clicked with selection', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    // Select second customer
    fireEvent.click(screen.getByText('Jane Smith'));
    fireEvent.click(screen.getByRole('button', { name: /update customer/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/update_customer/2');
  });

  it('navigates to delete customer page when delete button clicked with selection', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    // Select third customer
    fireEvent.click(screen.getByText('Bob Wilson'));
    fireEvent.click(screen.getByRole('button', { name: /delete customer/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/delete_customer/3');
  });

  it('does not navigate when delete button clicked with no selection', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    // Try to click disabled delete button
    const deleteButton = screen.getByRole('button', { name: /delete customer/i });
    fireEvent.click(deleteButton);
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows selecting different customers', () => {
    vi.mocked(getAll).mockReturnValue(mockCustomers);

    render(
      <MemoryRouter>
        <DisplayCustomers />
      </MemoryRouter>
    );

    const johnRow = screen.getByText('John Doe').closest('tr');
    const janeRow = screen.getByText('Jane Smith').closest('tr');

    // Select John
    fireEvent.click(screen.getByText('John Doe'));
    expect(johnRow).toHaveClass('selected-row');
    expect(janeRow).not.toHaveClass('selected-row');

    // Select Jane (should deselect John)
    fireEvent.click(screen.getByText('Jane Smith'));
    expect(johnRow).not.toHaveClass('selected-row');
    expect(janeRow).toHaveClass('selected-row');
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
    
    // Should navigate with customers.length + 1 = 6
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
    
    // Should navigate with customers.length + 1 = 1
    expect(mockNavigate).toHaveBeenCalledWith('/add_customer/1');
  });
});
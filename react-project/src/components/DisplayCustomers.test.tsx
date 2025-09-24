import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, expect, vi, beforeEach } from 'vitest';
import DisplayCustomers from './DisplayCustomers';
import { MemoryRouter } from 'react-router-dom';

// Mock memdb
vi.mock('../../../ProjectAssets/memdb.js', () => ({
  getAll: vi.fn(),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

// Mock child components to avoid testing their internal logic
vi.mock('./AddCustomer', () => ({
  default: ({ onCustomerAdded, onCancel, id }: any) => (
    <div data-testid="add-customer-component">
      <span data-testid="add-customer-id">ID: {id}</span>
      <button data-testid="mock-add-submit" onClick={() => onCustomerAdded?.()}>
        Add Customer
      </button>
      <button data-testid="mock-add-cancel" onClick={() => onCancel?.()}>
        Cancel
      </button>
    </div>
  ),
}));

vi.mock('./UpdateCustomer', () => ({
  default: ({ customerId, onCustomerUpdated, onCancel }: any) => (
    <div data-testid="update-customer-component">
      <span data-testid="update-customer-id">Customer ID: {customerId}</span>
      <button data-testid="mock-update-submit" onClick={() => onCustomerUpdated?.()}>
        Update Customer
      </button>
      <button data-testid="mock-update-cancel" onClick={() => onCancel?.()}>
        Cancel
      </button>
    </div>
  ),
}));

import { getAll } from '../../../ProjectAssets/memdb.js';

const mockCustomers = [
  { id: 0, name: 'John Doe', email: 'john@example.com', password: 'password123' },
  { id: 1, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
  { id: 2, name: 'Bob Johnson', email: 'bob@example.com', password: 'password789' },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('DisplayCustomers Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    vi.mocked(getAll).mockReturnValue(mockCustomers);
  });

  test('renders customer table with data and correct structure', () => {
    renderWithRouter(<DisplayCustomers />);
    
    // Check basic structure
    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByTestId('customer-table')).toBeInTheDocument();
    expect(getAll).toHaveBeenCalledWith('customers');
    
    // Check all customers are displayed
    expect(screen.getByTestId('customer-row-0')).toBeInTheDocument();
    expect(screen.getByTestId('customer-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('customer-row-2')).toBeInTheDocument();
  });

  test('handles customer selection and shows appropriate form', () => {
    renderWithRouter(<DisplayCustomers />);
    
    // Initially shows AddCustomer
    expect(screen.getByTestId('add-customer-component')).toBeInTheDocument();
    expect(screen.queryByTestId('update-customer-component')).not.toBeInTheDocument();
    
    // Click to select customer
    fireEvent.click(screen.getByTestId('customer-row-1'));
    expect(screen.getByTestId('update-customer-component')).toBeInTheDocument();
    expect(screen.queryByTestId('add-customer-component')).not.toBeInTheDocument();
    
    // Click again to deselect
    fireEvent.click(screen.getByTestId('customer-row-1'));
    expect(screen.getByTestId('add-customer-component')).toBeInTheDocument();
    expect(screen.queryByTestId('update-customer-component')).not.toBeInTheDocument();
  });

  test('handles customer with ID 0 correctly', () => {
    renderWithRouter(<DisplayCustomers />);
    
    fireEvent.click(screen.getByTestId('customer-row-0'));
    expect(screen.getByTestId('update-customer-component')).toBeInTheDocument();
    expect(screen.getByTestId('update-customer-id')).toHaveTextContent('Customer ID: 0');
  });

  test('manages delete button state and navigation', () => {
    renderWithRouter(<DisplayCustomers />);
    
    const deleteButton = screen.getByTestId('delete-customer-button');
    
    // Initially disabled
    expect(deleteButton).toBeDisabled();
    
    // Click button with no selection - no navigation
    fireEvent.click(deleteButton);
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Select customer - button enabled
    fireEvent.click(screen.getByTestId('customer-row-1'));
    expect(deleteButton).not.toBeDisabled();
    
    // Click button with selection - navigates
    fireEvent.click(deleteButton);
    expect(mockNavigate).toHaveBeenCalledWith('/delete_customer/1');
  });

  test('handles empty customer list', () => {
    vi.mocked(getAll).mockReturnValue([]);
    renderWithRouter(<DisplayCustomers />);
    
    expect(screen.getByTestId('customer-table')).toBeInTheDocument();
    expect(screen.getByTestId('add-customer-component')).toBeInTheDocument();
    expect(screen.getByTestId('add-customer-id')).toHaveTextContent('ID: 1');
  });

  test('refreshCustomers function updates data and resets selection', async () => {
    const { rerender } = renderWithRouter(<DisplayCustomers />);
    
    // Select a customer initially
    fireEvent.click(screen.getByTestId('customer-row-1'));
    expect(screen.getByTestId('update-customer-component')).toBeInTheDocument();
    
    // Change mock data to simulate a refresh scenario
    const updatedCustomers = [
      { id: 0, name: 'John Doe', email: 'john@example.com', password: 'password123' },
      { id: 1, name: 'Jane Updated', email: 'jane.updated@example.com', password: 'password456' },
      { id: 3, name: 'New Customer', email: 'new@example.com', password: 'newpass' }
    ];
    vi.mocked(getAll).mockReturnValue(updatedCustomers);
    
    // Trigger refreshCustomers by calling onCustomerUpdated callback from UpdateCustomer
    const mockUpdateSubmit = screen.getByTestId('mock-update-submit');
    fireEvent.click(mockUpdateSubmit);
    
    // Wait for setTimeout to execute
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Force a re-render to see the changes
    rerender(<DisplayCustomers />);
    
    // Verify the refresh behavior:
    // 1. getAll was called again to fetch fresh data
    expect(vi.mocked(getAll)).toHaveBeenCalledWith('customers');
    
    // 2. Selection was reset (should show AddCustomer, not UpdateCustomer)  
    expect(screen.getByTestId('add-customer-component')).toBeInTheDocument();
    expect(screen.queryByTestId('update-customer-component')).not.toBeInTheDocument();
    
    // 3. Customer data was updated (new customer should be visible)
    expect(screen.getByTestId('customer-row-3')).toBeInTheDocument();
    expect(screen.getByText('New Customer')).toBeInTheDocument();
    
    // 4. Updated customer data should be reflected
    expect(screen.getByText('Jane Updated')).toBeInTheDocument();
  });
});
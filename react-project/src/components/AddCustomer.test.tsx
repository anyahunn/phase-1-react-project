import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddCustomer from './AddCustomer';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../../ProjectAssets/memdb.js', () => ({
  post: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

import * as memdb from '../../../ProjectAssets/memdb.js';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('AddCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    vi.mocked(memdb.post).mockReset();
  });

  describe('Standalone Usage', () => {
    it('renders form with correct structure and handles input changes', () => {
      renderWithRouter(<AddCustomer />);
      
      expect(screen.getByTestId('add-customer-title')).toHaveTextContent('Add Customer');
      expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByTestId('add-customer-submit')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      
      // Test input changes
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    });

    it('submits form with correct data and navigates', () => {
      renderWithRouter(<AddCustomer />);
      
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Smith' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } });
      fireEvent.click(screen.getByTestId('add-customer-submit'));
      
      expect(vi.mocked(memdb.post)).toHaveBeenCalledWith({
        id: 123,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'secret123',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates home when cancel is clicked', () => {
      renderWithRouter(<AddCustomer />);
      
      fireEvent.click(screen.getByText('Cancel'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(vi.mocked(memdb.post)).not.toHaveBeenCalled();
    });
  });

  describe('Embedded Usage (with props)', () => {
    it('uses provided ID instead of URL param', () => {
      renderWithRouter(<AddCustomer id={999} />);
      
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpass' } });
      fireEvent.click(screen.getByTestId('add-customer-submit'));
      
      expect(vi.mocked(memdb.post)).toHaveBeenCalledWith({
        id: 999,
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass',
      });
    });

    it('calls onCustomerAdded callback instead of navigating', () => {
      const mockOnCustomerAdded = vi.fn();
      renderWithRouter(<AddCustomer id={5} onCustomerAdded={mockOnCustomerAdded} />);
      
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Callback User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'callback@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'callbackpass' } });
      fireEvent.click(screen.getByTestId('add-customer-submit'));
      
      expect(mockOnCustomerAdded).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('calls onCancel callback instead of navigating', () => {
      const mockOnCancel = vi.fn();
      renderWithRouter(<AddCustomer onCancel={mockOnCancel} />);
      
      fireEvent.click(screen.getByText('Cancel'));
      
      expect(mockOnCancel).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('clears form after successful submission', () => {
      const mockOnCustomerAdded = vi.fn();
      renderWithRouter(<AddCustomer id={10} onCustomerAdded={mockOnCustomerAdded} />);
      
      // Fill form
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Clear Test' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'clear@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'clearpass' } });
      
      // Submit form
      fireEvent.click(screen.getByTestId('add-customer-submit'));
      
      // Form should be cleared
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
    });
  });
});
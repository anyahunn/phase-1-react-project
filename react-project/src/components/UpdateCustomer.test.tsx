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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

const mockCustomer = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
};

const mockCustomerZero = {
  id: 0,
  name: 'Zero Customer',
  email: 'zero@example.com',
  password: 'zeropass'
};

describe('UpdateCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    vi.mocked(memdb.get).mockReset();
    vi.mocked(memdb.put).mockReset();
    vi.mocked(useParams).mockReset();
  });

  describe('Standalone Usage', () => {
    test('renders form with correct structure', () => {
      vi.mocked(useParams).mockReturnValue({ id: '1' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer />);

      expect(screen.getByTestId('update-customer-title')).toHaveTextContent('Update Customer');
      expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByTestId('update-customer-button')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('loads and displays existing customer data', async () => {
      vi.mocked(useParams).mockReturnValue({ id: '1' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer />);

      expect(memdb.get).toHaveBeenCalledWith(1);

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
        expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
        expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
      });
    });

    test('handles input changes correctly', async () => {
      vi.mocked(useParams).mockReturnValue({ id: '1' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer />);

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      });

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Updated' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john.updated@example.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'newpassword' } });

      expect(screen.getByLabelText(/name/i)).toHaveValue('John Updated');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john.updated@example.com');
      expect(screen.getByLabelText(/password/i)).toHaveValue('newpassword');
    });

    test('submits updated data and navigates', async () => {
      vi.mocked(useParams).mockReturnValue({ id: '1' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer />);

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      });

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Updated' } });
      fireEvent.click(screen.getByTestId('update-customer-button'));

      expect(memdb.put).toHaveBeenCalledWith(1, {
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('navigates when cancel is clicked', () => {
      vi.mocked(useParams).mockReturnValue({ id: '1' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer />);

      fireEvent.click(screen.getByText('Cancel'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(memdb.put).not.toHaveBeenCalled();
    });

    test('handles customer not found scenario', () => {
      vi.mocked(useParams).mockReturnValue({ id: '999' });
      vi.mocked(memdb.get).mockReturnValue(null);

      renderWithRouter(<UpdateCustomer />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
    });
  });

  describe('Embedded Usage (with props)', () => {
    test('uses customerId prop instead of URL param', async () => {
      vi.mocked(useParams).mockReturnValue({});
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer customerId={1} />);

      expect(memdb.get).toHaveBeenCalledWith(1);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      });
    });

    test('handles customer ID 0 correctly with nullish coalescing', async () => {
      vi.mocked(useParams).mockReturnValue({});
      vi.mocked(memdb.get).mockReturnValue(mockCustomerZero);

      renderWithRouter(<UpdateCustomer customerId={0} />);

      // Should call memdb.get with 0, not fall back to NaN
      expect(memdb.get).toHaveBeenCalledWith(0);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('Zero Customer');
        expect(screen.getByLabelText(/email/i)).toHaveValue('zero@example.com');
      });
    });

    test('calls onCustomerUpdated callback instead of navigating', async () => {
      const mockOnCustomerUpdated = vi.fn();
      vi.mocked(useParams).mockReturnValue({});
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer customerId={1} onCustomerUpdated={mockOnCustomerUpdated} />);

      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      });

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Updated Name' } });
      fireEvent.click(screen.getByTestId('update-customer-button'));

      expect(mockOnCustomerUpdated).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('calls onCancel callback instead of navigating', () => {
      const mockOnCancel = vi.fn();
      vi.mocked(useParams).mockReturnValue({});
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer customerId={1} onCancel={mockOnCancel} />);

      fireEvent.click(screen.getByText('Cancel'));

      expect(mockOnCancel).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('prioritizes prop ID over URL param when both are provided', async () => {
      vi.mocked(useParams).mockReturnValue({ id: '999' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer customerId={1} />);

      // Should use customerId prop (1), not URL param (999)
      expect(memdb.get).toHaveBeenCalledWith(1);
      expect(memdb.get).not.toHaveBeenCalledWith(999);
    });

    test('falls back to URL param when customerId prop is undefined', async () => {
      vi.mocked(useParams).mockReturnValue({ id: '5' });
      vi.mocked(memdb.get).mockReturnValue(mockCustomer);

      renderWithRouter(<UpdateCustomer customerId={undefined} />);

      expect(memdb.get).toHaveBeenCalledWith(5);
    });
  });

  describe('Edge Cases', () => {
    test('handles string ID parameter conversion', async () => {
      vi.mocked(useParams).mockReturnValue({ id: '42' });
      const customer42 = { ...mockCustomer, id: 42 };
      vi.mocked(memdb.get).mockReturnValue(customer42);

      renderWithRouter(<UpdateCustomer />);

      expect(memdb.get).toHaveBeenCalledWith(42);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      });

      fireEvent.click(screen.getByTestId('update-customer-button'));

      expect(memdb.put).toHaveBeenCalledWith(42, expect.objectContaining({ id: 42 }));
    });

    test('prevents submission with empty form', () => {
      vi.mocked(useParams).mockReturnValue({ id: '1' });
      vi.mocked(memdb.get).mockReturnValue(null);

      renderWithRouter(<UpdateCustomer />);

      fireEvent.click(screen.getByTestId('update-customer-button'));

      // HTML5 validation should prevent submission, so memdb.put shouldn't be called
      expect(memdb.put).not.toHaveBeenCalled();
    });
  });
});
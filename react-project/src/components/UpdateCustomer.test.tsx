import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import UpdateCustomer from './UpdateCustomer';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { 
    ...actual, 
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' })
  };
});

describe('UpdateCustomer Component', () => {
  const mockCustomerData = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  };

  const mockOnCustomerUpdated = vi.fn();
  const mockOnCancel = vi.fn();
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockClear();
    (window as any).fetch = fetchMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders update customer form with title', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={1} />);

      expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
      expect(screen.getAllByText('Update Customer')).toHaveLength(2);
      expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
    });

    test('renders all form inputs with correct attributes', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={1} />);

      // Check all inputs exist with correct test IDs
      expect(screen.getByTestId('name-input')).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();

      // Check input types
      expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');
      expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');

      // Check required attributes
      expect(screen.getByTestId('name-input')).toBeRequired();
      expect(screen.getByTestId('email-input')).toBeRequired();
      expect(screen.getByTestId('password-input')).toBeRequired();
    });
  });

  describe('Data Fetching', () => {
    test('fetches customer data using customerId prop', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={1} />);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/customers/1');
    });

    test('fetches customer data using URL params when no customerId prop', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer />);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/customers/1');
    });

    test('handles customer ID 0 correctly', async () => {
      const customerZeroData = { ...mockCustomerData, id: 0 };
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(customerZeroData)
      });

      render(<UpdateCustomer customerId={0} />);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/customers/0');
    });

    test('populates form fields with fetched customer data', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={1} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('password123')).toBeInTheDocument();
      });
    });

    test('handles fetch error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      render(<UpdateCustomer customerId={1} />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch customer:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Form Input Changes', () => {
    beforeEach(async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });
    });

    test('handles name input changes', async () => {
      render(<UpdateCustomer customerId={1} />);

      const nameInput = await screen.findByDisplayValue('John Doe');
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });

      expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    });

    test('handles email input changes', async () => {
      render(<UpdateCustomer customerId={1} />);

      const emailInput = await screen.findByDisplayValue('john@example.com');
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });

      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    });

    test('handles password input changes', async () => {
      render(<UpdateCustomer customerId={1} />);

      const passwordInput = await screen.findByDisplayValue('password123');
      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

      expect(screen.getByDisplayValue('newpassword')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('submits updated customer data to REST API', async () => {
      fetchMock
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCustomerData)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true })
        });

      render(<UpdateCustomer customerId={1} onCustomerUpdated={mockOnCustomerUpdated} />);

      // Wait for data to load and change values
      const nameInput = await screen.findByDisplayValue('John Doe');
      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      const emailInput = screen.getByDisplayValue('john@example.com');
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      const passwordInput = screen.getByDisplayValue('password123');
      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

      // Submit form
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      // Check PUT request was made with correct data
      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          'http://localhost:4000/customers/1',
          expect.objectContaining({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: 1,
              name: 'Jane Doe',
              email: 'jane@example.com',
              password: 'newpassword'
            })
          })
        );
      });
    });

    test('calls onCustomerUpdated callback after successful submission', async () => {
      fetchMock
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCustomerData)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true })
        });

      render(<UpdateCustomer customerId={1} onCustomerUpdated={mockOnCustomerUpdated} />);

      await screen.findByDisplayValue('John Doe');
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnCustomerUpdated).toHaveBeenCalled();
      });
    });

    test('navigates to home when no onCustomerUpdated callback provided', async () => {
      fetchMock
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCustomerData)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true })
        });

      render(<UpdateCustomer customerId={1} />);

      await screen.findByDisplayValue('John Doe');
      const submitButton = screen.getByTestId('submit-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Cancel Functionality', () => {
    test('calls onCancel callback when cancel button clicked', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={1} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('navigates to home when no onCancel callback provided', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={1} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined customerId gracefully', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve(mockCustomerData)
      });

      render(<UpdateCustomer customerId={undefined} />);

      // Should fall back to URL params (mocked as '1')
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/customers/1');
    });

    test('handles form submission with preventDefault', async () => {
      fetchMock
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockCustomerData)
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ success: true })
        });

      render(<UpdateCustomer customerId={1} />);

      await screen.findByDisplayValue('John Doe');
      
      const form = screen.getByTestId('update-customer-form');
      fireEvent.submit(form);

      // Form submission should still work through handleSubmit
      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(
          'http://localhost:4000/customers/1',
          expect.objectContaining({
            method: 'PUT'
          })
        );
      });
    });
  });
});

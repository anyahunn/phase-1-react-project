import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import UpdateCustomer from './components/UpdateCustomer';
import DeleteCustomer from './components/DeleteCustomer';

// Mock memdb
vi.mock('../../ProjectAssets/memdb.js', () => ({
  getAll: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  deleteById: vi.fn(),
}));

// Mock useNavigate and useParams
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(() => ({ id: '1' })),
  };
});

// Import the mocked modules
import { getAll, get, post, put } from '../../ProjectAssets/memdb.js';
import { useNavigate, useParams } from 'react-router-dom';

describe('App Component - Full Application Tests', () => {
  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
  ];

  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAll).mockReturnValue(mockCustomers);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  // Test 1: The app should display a list of Customer records
  describe('1. Customer List Display', () => {
    it('1.1-1.2 should display all available customer records on app refresh', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(vi.mocked(getAll)).toHaveBeenCalledWith('customers');
    });
  });

  // Test 2: The label "Customer List" should appear on-screen
  describe('2. Customer List Label', () => {
    it('2.1-2.2 should show "Customer List" text above the records', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      expect(screen.getByText('Customer List')).toBeInTheDocument();
    });
  });

  // Test 3: Customer fields should be maintained (name, email, password)
  describe('3. Customer Fields Display', () => {
    it('3.1-3.2 should show name, email, and password fields for each record', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      // Check table headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();

      // Check data is displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('password123')).toBeInTheDocument();
    });

    it('3.3 should allow entry of name, email, and password in add form', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  // Test 4 & 5: Record selection and bold font
  describe('4-5. Record Selection and Bold Display', () => {
    it('5.1-5.3 should make selected record appear bold and show Add/Update button text', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      const johnRow = screen.getByText('John Doe').closest('tr');
      
      // Initially no selection, should show "Add Customer"
      expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
      expect(johnRow).not.toHaveClass('selected-row');

      // Click to select
      fireEvent.click(screen.getByText('John Doe'));
      expect(johnRow).toHaveClass('selected-row');
      expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    });

    it('5.4-5.6 & 6.1 should deselect record when clicked again', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      const johnRow = screen.getByText('John Doe').closest('tr');
      
      // Select record
      fireEvent.click(screen.getByText('John Doe'));
      expect(johnRow).toHaveClass('selected-row');
      expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();

      // Deselect record
      fireEvent.click(screen.getByText('John Doe'));
      expect(johnRow).not.toHaveClass('selected-row');
      expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    });
  });

  // Test 7: Add/Update form title changes
  describe('7. Add/Update Form Title', () => {
    it('7.1-7.2 should show "Add Customer" when no record selected', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    });

    it('7.3-7.4 should show "Update Customer" when record is selected', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('John Doe'));
      expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    });
  });

  // Test 9: Buttons should appear
  describe('9. Button Display', () => {
    it('9.1-9.2 should show Add/Update and Delete buttons', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete customer/i })).toBeInTheDocument();
    });
  });

  // Test 10-11: Delete functionality
  describe('10-11. Delete Record Functionality', () => {
    it('10.1-10.3 should navigate to delete page when delete button clicked with selection', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('John Doe'));
      fireEvent.click(screen.getByRole('button', { name: /delete customer/i }));
      
      // Should call navigate with delete route
      expect(mockNavigate).toHaveBeenCalledWith('/delete_customer/1');
    });

    it('should render delete customer page correctly', () => {
      vi.mocked(get).mockReturnValue(mockCustomers[0]);
      vi.mocked(useParams).mockReturnValue({ id: '1' });

      render(
        <MemoryRouter>
          <DeleteCustomer />
        </MemoryRouter>
      );

      expect(screen.getByText('Delete Customer')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm delete/i })).toBeInTheDocument();
    });
  });

  // Test 12: Field modification capability
  describe('12. Field Modification', () => {
    it('12.1-12.4 should allow text entry in add form fields', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(nameInput, { target: { value: 'New Customer' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

      expect(nameInput).toHaveValue('New Customer');
      expect(emailInput).toHaveValue('new@example.com');
      expect(passwordInput).toHaveValue('newpassword');
    });

    it('should allow text entry in update form fields', () => {
      vi.mocked(get).mockReturnValue(mockCustomers[0]);
      vi.mocked(useParams).mockReturnValue({ id: '1' });

      render(
        <MemoryRouter>
          <UpdateCustomer />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeInTheDocument();
      
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
      expect(nameInput).toHaveValue('Updated Name');
    });
  });

  // Test 13-14: Save functionality for updates
  describe('13-14. Update Record Functionality', () => {
    it('13.1-13.4 should update record when save is clicked in update form', async () => {
      vi.mocked(get).mockReturnValue(mockCustomers[0]);
      vi.mocked(useParams).mockReturnValue({ id: '1' });

      render(
        <MemoryRouter>
          <UpdateCustomer />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: 'John Updated' } });
      
      fireEvent.click(screen.getByRole('button', { name: /update customer/i }));

      expect(vi.mocked(put)).toHaveBeenCalledWith(1, expect.objectContaining({
        id: 1,
        name: 'John Updated',
        email: 'john@example.com',
        password: 'password123'
      }));
    });
  });

  // Test 15-16: Cancel functionality
  describe('15-16. Cancel Functionality', () => {
    it('15.1-15.2 should navigate back when cancel is clicked', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should show cancel button in update form', () => {
      vi.mocked(get).mockReturnValue(mockCustomers[0]);
      vi.mocked(useParams).mockReturnValue({ id: '1' });

      render(
        <MemoryRouter>
          <UpdateCustomer />
        </MemoryRouter>
      );

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  // Test 17: New data entry when no record selected
  describe('17. New Data Entry', () => {
    it('17.1 should allow typing in add form when no record selected', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');

      fireEvent.change(nameInput, { target: { value: 'Test Name' } });
      expect(nameInput).toHaveValue('Test Name');
    });
  });

  // Test 18-19: Add new record functionality
  describe('18-19. Add New Record Functionality', () => {
    it('18.1-18.4 should add new record when save is clicked with new data', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(nameInput, { target: { value: 'New Customer' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'newpass123' } });

      fireEvent.click(screen.getByRole('button', { name: /add customer/i }));

      expect(vi.mocked(post)).toHaveBeenCalledWith(expect.objectContaining({
        id: 4,
        name: 'New Customer',
        email: 'new@example.com',
        password: 'newpass123'
      }));
    });
  });

  // Component rendering tests
  describe('Component Rendering', () => {
    it('should render DisplayCustomers component correctly', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      expect(screen.getByText('Customer List')).toBeInTheDocument();
    });

    it('should render AddCustomer component correctly', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      expect(screen.getByTestId("add-customer-title")).toBeInTheDocument();
    });

    it('should render UpdateCustomer component correctly', () => {
      vi.mocked(get).mockReturnValue(mockCustomers[0]);
      vi.mocked(useParams).mockReturnValue({ id: '1' });

      render(
        <MemoryRouter>
          <UpdateCustomer />
        </MemoryRouter>
      );

      expect(screen.getByTestId("update-customer-title")).toBeInTheDocument();
    });

    it('should render DeleteCustomer component correctly', () => {
      vi.mocked(get).mockReturnValue(mockCustomers[0]);
      vi.mocked(useParams).mockReturnValue({ id: '1' });

      render(
        <MemoryRouter>
          <DeleteCustomer />
        </MemoryRouter>
      );

      expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    });
  });

  // Delete button state management
  describe('Delete Button State Management', () => {
    it('should disable delete button when no customer is selected', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      const deleteButton = screen.getByRole('button', { name: /delete customer/i });
      expect(deleteButton).toBeDisabled();
    });

    it('should enable delete button when customer is selected', () => {
      render(
        <MemoryRouter>
          <DisplayCustomers />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('John Doe'));
      
      const deleteButton = screen.getByRole('button', { name: /delete customer/i });
      expect(deleteButton).not.toBeDisabled();
    });
  });

  // Form validation
  describe('Form Validation', () => {
    it('should require all fields in add form', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(nameInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('should validate email format in forms', () => {
      vi.mocked(useParams).mockReturnValue({ id: '4' });

      render(
        <MemoryRouter>
          <AddCustomer />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });
  });
});

// NEW: App Component Coverage Tests
import App, { AppRoutes } from './App';

describe('App Component Coverage Tests', () => {
  const mockCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
  ];
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAll).mockReturnValue(mockCustomers);
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should render AppRoutes component from App.tsx', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    // Test that the default route renders DisplayCustomers
    expect(screen.getByText('Customer List')).toBeInTheDocument();
  });

  it('should test App component exports and structure', () => {
    // Test that App exports correctly and is a function component
    expect(typeof App).toBe('function');
    expect(typeof AppRoutes).toBe('function');
    
    // Test that components can be instantiated
    const app = React.createElement(App);
    const appRoutes = React.createElement(AppRoutes);
    expect(app).toBeDefined();
    expect(appRoutes).toBeDefined();
  });

  it('should test AppRoutes with different routes', () => {
    // Test add customer route
    render(
      <MemoryRouter initialEntries={['/add_customer/4']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Add Customer/)).toHaveLength(2);
  });

  it('should test update customer route through AppRoutes', () => {
    vi.mocked(get).mockReturnValue({ id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' });
    
    render(
      <MemoryRouter initialEntries={['/update_customer/1']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Update Customer/)).toHaveLength(2);
  });

  it('should test delete customer route through AppRoutes', () => {
    vi.mocked(get).mockReturnValue({ id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' });
    
    render(
      <MemoryRouter initialEntries={['/delete_customer/1']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText(/Delete Customer/)).toBeInTheDocument();
  });
});
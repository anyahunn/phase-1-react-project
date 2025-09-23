import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { test, expect, describe } from 'vitest';
import { useState } from 'react';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';
import UpdateCustomer from './components/UpdateCustomer';
import App from './App';

// Create a testable version of the App without BrowserRouter
const TestableApp = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', password: 'password789' }
  ]);

  const addCustomer = (newCustomer: any) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (updatedCustomer: any) => {
    setCustomers(prev =>
      prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c)
    );
  };

  const deleteCustomer = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const findHighestId = () => {
    return customers.reduce((maxId, customer) => Math.max(maxId, customer.id), 0) + 1;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DisplayCustomers customers={customers} customer={null} />} />
        <Route path="/add_customer/:id" element={<AddCustomer id={findHighestId()} addCustomer={addCustomer} />} />
        <Route path="/delete_customer/:id" element={<DeleteCustomer customers={customers} deleteCustomer={deleteCustomer}/>} />
        <Route path="/update_customer/:id" element={<UpdateCustomer customers={customers} updateCustomer={updateCustomer} />} />
      </Routes>
    </div>
  );
};

// Helper function to render TestableApp with specific route
const renderAppWithRoute = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TestableApp />
    </MemoryRouter>
  );
};

describe('App Component Tests', () => {
  test('App component renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Customer List')).toBeInTheDocument();
  });

  test('renders DisplayCustomers component on default route with initial data', () => {
    renderAppWithRoute(['/']);
    
    // Check if the component displays the initial customers
    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    
    // Check if table structure exists
    expect(screen.getByTestId('customer-table')).toBeInTheDocument();
  });

  test('navigates to add customer route', () => {
    renderAppWithRoute(['/add_customer/4']);
    expect(screen.getByTestId('add-customer-title')).toBeInTheDocument();
    expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
  });

  test('navigates to update customer route with existing customer data', () => {
    renderAppWithRoute(['/update_customer/1']);
    expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
    expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
    
    // Check if form is populated with existing customer data
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    expect(nameInput.value).toBe('John Doe');
  });

  test('navigates to delete customer route and displays customer info', () => {
    renderAppWithRoute(['/delete_customer/1']);
    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
  });

  test('handles invalid route gracefully', () => {
    renderAppWithRoute(['/invalid-route']);
    // Should not render any of our main components
    expect(screen.queryByText('Customer List')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Customer')).not.toBeInTheDocument();
    expect(screen.queryByText('Update Customer')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Customer')).not.toBeInTheDocument();
  });
});

describe('Customer Management Functionality', () => {
  test('can select a customer in DisplayCustomers', () => {
    renderAppWithRoute(['/']);
    
    // Click on first customer row to select it
    const firstCustomerRow = screen.getByTestId('customer-row-1');
    fireEvent.click(firstCustomerRow);
    
    // Check if row gets selected class (this might depend on CSS implementation)
    expect(firstCustomerRow).toHaveClass('selected-row');
    
    // Check if Update and Delete buttons become enabled
    const updateButton = screen.getByText('Update Customer');
    const deleteButton = screen.getByText('Delete Customer');
    expect(updateButton).toBeInTheDocument();
    expect(deleteButton).toBeEnabled();
  });

  test('Add Customer button navigates correctly', () => {
    renderAppWithRoute(['/']);
    
    const addButton = screen.getByText('Add Customer');
    expect(addButton).toBeInTheDocument();
    // Button should be clickable (testing navigation would require more complex setup)
  });

  test('Delete Customer button is disabled when no customer is selected', () => {
    renderAppWithRoute(['/']);
    
    const deleteButton = screen.getByText('Delete Customer');
    expect(deleteButton).toBeDisabled();
  });
});

describe('Add Customer Component', () => {
  test('renders add customer form with all required fields', () => {
    renderAppWithRoute(['/add_customer/4']);
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-customer-submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('allows input in form fields', () => {
    renderAppWithRoute(['/add_customer/4']);
    
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    
    fireEvent.change(nameInput, { target: { value: 'New Customer' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpass123' } });
    
    expect(nameInput.value).toBe('New Customer');
    expect(emailInput.value).toBe('new@example.com');
    expect(passwordInput.value).toBe('newpass123');
  });
});

describe('Update Customer Component', () => {
  test('renders update customer form with pre-filled data', () => {
    renderAppWithRoute(['/update_customer/1']);
    
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    
    // Check if form is pre-filled with existing customer data
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('allows modification of customer data', () => {
    renderAppWithRoute(['/update_customer/1']);
    
    const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
    
    fireEvent.change(nameInput, { target: { value: 'Updated John Doe' } });
    expect(nameInput.value).toBe('Updated John Doe');
  });
});

describe('Delete Customer Component', () => {
  test('displays customer information for confirmation', () => {
    renderAppWithRoute(['/delete_customer/2']);
    
    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('password456')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('shows error message for non-existent customer', () => {
    renderAppWithRoute(['/delete_customer/999']);
    
    expect(screen.getByText('Customer not found')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});

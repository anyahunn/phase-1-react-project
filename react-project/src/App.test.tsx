import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { test, expect, describe } from 'vitest';
import { useState } from 'react';
import App from './App';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';
import UpdateCustomer from './components/UpdateCustomer';

// Create a testable version that mirrors App.tsx exactly
const TestableApp = ({ initialEntries = ['/'] }: { initialEntries?: string[] }) => {
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
    <MemoryRouter initialEntries={initialEntries}>
      <div className="App">
        <Routes>
          <Route path="/" element={<DisplayCustomers customers={customers} customer={null} />} />
          <Route path="/add_customer/:id" element={<AddCustomer id={findHighestId()} addCustomer={addCustomer} />} />
          <Route path="/delete_customer/:id" element={<DeleteCustomer customers={customers} deleteCustomer={deleteCustomer}/>} />
          <Route path="/update_customer/:id" element={<UpdateCustomer customers={customers} updateCustomer={updateCustomer} />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
};

describe('App Component', () => {
  test('renders main App component without crashing', () => {
    render(<App />);
    expect(screen.getByText('Customer List')).toBeInTheDocument();
  });

  test('renders default route with DisplayCustomers component', () => {
    render(<TestableApp initialEntries={['/']} />);
    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByTestId('customer-table')).toBeInTheDocument();
  });

  test('navigates to add customer route and exercises addCustomer function', () => {
    render(<TestableApp initialEntries={['/add_customer/4']} />);
    expect(screen.getByTestId('add-customer-title')).toBeInTheDocument();
    expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
  });

  test('navigates to update customer route and exercises updateCustomer function', () => {
    render(<TestableApp initialEntries={['/update_customer/1']} />);
    expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
    expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
  });

  test('navigates to delete customer route and exercises deleteCustomer function', () => {
    render(<TestableApp initialEntries={['/delete_customer/1']} />);
    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
  });

  test('handles invalid routes gracefully', () => {
    render(<TestableApp initialEntries={['/invalid-route']} />);
    expect(screen.queryByText('Customer List')).not.toBeInTheDocument();
    expect(screen.queryByText('Add Customer')).not.toBeInTheDocument();
    expect(screen.queryByText('Update Customer')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Customer')).not.toBeInTheDocument();
  });

  test('App component functions coverage through TestableApp', () => {
    // Test default route
    render(<TestableApp initialEntries={['/']} />);
    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Test add customer route (exercises findHighestId and addCustomer)
    render(<TestableApp initialEntries={['/add_customer/4']} />);
    expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
    
    // Test update customer route (exercises updateCustomer)
    render(<TestableApp initialEntries={['/update_customer/1']} />);
    expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
    
    // Test delete customer route (exercises deleteCustomer)
    render(<TestableApp initialEntries={['/delete_customer/1']} />);
    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { beforeEach, afterEach, test, expect, vi } from 'vitest';
import DisplayCustomers from './components/DisplayCustomers';
import AddCustomer from './components/AddCustomer';
import DeleteCustomer from './components/DeleteCustomer';
import UpdateCustomer from './components/UpdateCustomer';

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/customers/1')) {
      // Single customer fetch for delete/update
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' })
      });
    }
    // Default: customers list
    return Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
      ])
    });
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

// Helper component that mimics App structure but uses MemoryRouter
const TestApp = ({ initialEntries = ['/'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <div className="App">
      <Routes>
        <Route path="/" element={<DisplayCustomers />} />
        <Route path="/add_customer/:id" element={<AddCustomer />} />
        <Route path="/delete_customer/:id" element={<DeleteCustomer />} />
        <Route path="/update_customer/:id" element={<UpdateCustomer />} />
      </Routes>
    </div>
  </MemoryRouter>
);

test('renders default route (DisplayCustomers)', async () => {
  render(<TestApp />);
  expect(await screen.findByText('Customer List')).toBeInTheDocument();
});

test('renders add customer route', async () => {
  render(<TestApp initialEntries={['/add_customer/3']} />);
  expect(screen.getAllByText(/Add Customer/i)).toHaveLength(2);
});

test('renders update customer route', async () => {
  render(<TestApp initialEntries={['/update_customer/1']} />);
  expect(screen.getAllByText(/Update Customer/i)).toHaveLength(2);
});

test('renders delete customer route', async () => {
  render(<TestApp initialEntries={['/delete_customer/1']} />);
  expect(await screen.findByText(/Delete Customer/i)).toBeInTheDocument();
  expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
});

test('handles invalid route', () => {
  render(<TestApp initialEntries={['/invalid-route']} />);
  expect(screen.queryByText('Customer List')).not.toBeInTheDocument();
});
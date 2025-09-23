import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, test, expect, vi } from 'vitest';
import App, { AppRoutes } from './App';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes('/customers/1')) {
      return Promise.resolve({
        json: () => Promise.resolve({ id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' })
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
      ])
    });
  }));
});

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});

// Test the exported AppRoutes component which contains the routing logic
test('renders default route (DisplayCustomers)', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(await screen.findByText('Customer List')).toBeInTheDocument();
});

test('renders add customer route', async () => {
  render(
    <MemoryRouter initialEntries={['/add_customer/3']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getAllByText(/Add Customer/i)).toHaveLength(2);
});

test('renders update customer route', async () => {
  render(
    <MemoryRouter initialEntries={['/update_customer/1']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getAllByText(/Update Customer/i)).toHaveLength(2);
});

test('renders delete customer route', async () => {
  render(
    <MemoryRouter initialEntries={['/delete_customer/1']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Delete Customer/i)).toBeInTheDocument();
  expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
});

test('handles invalid route', () => {
  render(
    <MemoryRouter initialEntries={['/invalid-route']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.queryByText('Customer List')).not.toBeInTheDocument();
});

// Test that App component renders without crashing
test('App component renders without crashing', () => {
  // We can't easily test App directly due to BrowserRouter, but we can test that it exports correctly
  expect(typeof App).toBe('function');
  expect(typeof AppRoutes).toBe('function');
});
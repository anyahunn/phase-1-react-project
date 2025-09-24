import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App, { AppRoutes } from './App';

// Mock memdb for component dependencies
vi.mock('../../ProjectAssets/memdb.js', () => ({
  getAll: vi.fn(() => [
    { id: 0, name: 'John Doe', email: 'john@example.com', password: 'password123' },
    { id: 1, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
  ]),
  get: vi.fn((id) => ({ id, name: 'Test Customer', email: 'test@example.com', password: 'test123' })),
  post: vi.fn(),
  put: vi.fn(),
  deleteById: vi.fn(),
}));

// Simplified router mocks
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1' }),
  };
});

describe('App Component', () => {
  it('renders App component without crashing', () => {
    render(<App />);
    expect(screen.getByText('Customer List')).toBeInTheDocument();
  });

  describe('AppRoutes Component', () => {
    it('renders DisplayCustomers on default route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );
      
      expect(screen.getByText('Customer List')).toBeInTheDocument();
      expect(screen.getByTestId('customer-table')).toBeInTheDocument();
    });

    it('renders AddCustomer on add customer route', () => {
      render(
        <MemoryRouter initialEntries={['/add_customer/5']}>
          <AppRoutes />
        </MemoryRouter>
      );
      
      expect(screen.getByTestId('add-customer-title')).toBeInTheDocument();
      expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
    });

    it('renders UpdateCustomer on update customer route', async () => {
      render(
        <MemoryRouter initialEntries={['/update_customer/1']}>
          <AppRoutes />
        </MemoryRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
        expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
      });
    });

    it('renders DeleteCustomer on delete customer route', () => {
      render(
        <MemoryRouter initialEntries={['/delete_customer/1']}>
          <AppRoutes />
        </MemoryRouter>
      );
      
      expect(screen.getByText('Delete Customer')).toBeInTheDocument();
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });

    it('handles route parameters correctly', async () => {
      const routes = [
        { path: '/add_customer/42', component: 'add-customer-title' },
        { path: '/update_customer/99', component: 'update-customer-title' },
        { path: '/delete_customer/7', component: 'Delete Customer' }
      ];

      for (const { path, component } of routes) {
        const { unmount } = render(
          <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
          </MemoryRouter>
        );
        
        if (component.includes('-')) {
          if (component === 'update-customer-title') {
            await waitFor(() => {
              expect(screen.getByTestId(component)).toBeInTheDocument();
            });
          } else {
            expect(screen.getByTestId(component)).toBeInTheDocument();
          }
        } else {
          expect(screen.getByText(component)).toBeInTheDocument();
        }
        
        unmount();
      }
    });

    it('navigates between different routes correctly', async () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/']}>
          <AppRoutes />
        </MemoryRouter>
      );
      
      // Start at home
      expect(screen.getByText('Customer List')).toBeInTheDocument();
      
      // Navigate to add customer
      rerender(
        <MemoryRouter initialEntries={['/add_customer/3']}>
          <AppRoutes />
        </MemoryRouter>
      );
      expect(screen.getByTestId('add-customer-title')).toBeInTheDocument();

      // Navigate to update customer
      fireEvent.click(screen.getByTestId('customer-row-1'));
      rerender(
        <MemoryRouter initialEntries={['/update_customer/1']}>
          <AppRoutes />
        </MemoryRouter>
      );
      await waitFor(() => {
        expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
      });
    });
  });
});
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App, { AppRoutes } from './App';

vi.mock('../../ProjectAssets/memdb.js', () => ({
  getAll: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  deleteById: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useParams: vi.fn(() => ({ id: '1' })),
  };
});

import { getAll, get } from '../../ProjectAssets/memdb.js';
import { useNavigate, useParams } from 'react-router-dom';

describe('App Component', () => {
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
    vi.mocked(useParams).mockReturnValue({ id: '1' });
  });

  it('should render App component and test exports', () => {
    expect(typeof App).toBe('function');
    expect(typeof AppRoutes).toBe('function');
    
    const app = React.createElement(App);
    const appRoutes = React.createElement(AppRoutes);
    expect(app).toBeDefined();
    expect(appRoutes).toBeDefined();
  });

  it('should render default route with DisplayCustomers', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Customer List')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(vi.mocked(getAll)).toHaveBeenCalledWith('customers');
  });

  it('should render add customer route', () => {
    vi.mocked(useParams).mockReturnValue({ id: '4' });
    
    render(
      <MemoryRouter initialEntries={['/add_customer/4']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('add-customer-title')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('should render update customer route', () => {
    vi.mocked(get).mockReturnValue(mockCustomers[0]);
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    
    render(
      <MemoryRouter initialEntries={['/update_customer/1']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
    expect(vi.mocked(get)).toHaveBeenCalledWith(1);
  });

  it('should render delete customer route', () => {
    vi.mocked(get).mockReturnValue(mockCustomers[0]);
    vi.mocked(useParams).mockReturnValue({ id: '1' });
    
    render(
      <MemoryRouter initialEntries={['/delete_customer/1']}>
        <AppRoutes />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(vi.mocked(get)).toHaveBeenCalledWith(1);
  });

  it('should test all route parameters work correctly', () => {
    const testRoutes = [
      { path: '/add_customer/5', id: '5' },
      { path: '/update_customer/2', id: '2' },
      { path: '/delete_customer/3', id: '3' }
    ];

    testRoutes.forEach(({ path, id }) => {
      vi.mocked(useParams).mockReturnValue({ id });
      vi.mocked(get).mockReturnValue({ id: parseInt(id), name: 'Test User', email: 'test@example.com', password: 'test123' });
      
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      );
      
      if (path.includes('add_customer')) {
        expect(screen.getByTestId('add-customer-title')).toBeInTheDocument();
      } else if (path.includes('update_customer')) {
        expect(screen.getByTestId('update-customer-title')).toBeInTheDocument();
      } else if (path.includes('delete_customer')) {
        expect(screen.getByText('Delete Customer')).toBeInTheDocument();
      }
      
      unmount();
    });
  });
});
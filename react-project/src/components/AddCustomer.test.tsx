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

describe('AddCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    vi.mocked(memdb.post).mockReset();
  });

  it('renders form fields and handles input changes', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p@ss4' } });
    expect(screen.getByLabelText(/name/i)).toHaveValue('Dana');
    expect(screen.getByLabelText(/email/i)).toHaveValue('dana@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('p@ss4');
  });

  it('calls memdb.post and navigates on submit', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'p@ss4' } });
    fireEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect(vi.mocked(memdb.post)).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 123,
        name: 'Dana',
        email: 'dana@example.com',
        password: 'p@ss4',
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates back when cancel is clicked', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
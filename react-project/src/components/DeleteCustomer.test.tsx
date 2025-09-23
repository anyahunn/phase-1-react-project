import './DeleteCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,  MemoryRouter, Route, Routes} from 'react-router-dom';
import React from 'react';
import DeleteCustomer from './DeleteCustomer.tsx';
import { describe, expect, test, vi, beforeEach } from 'vitest';


const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockCustomers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
        ];
const mockDeleteCustomer = vi.fn();

describe('DeleteCustomer Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders delete customer confirmation with selected customer data', () => {
        render(
            <MemoryRouter initialEntries={[`/delete_customer/1`]}>
                <Routes>
                    <Route path="/delete_customer/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Delete Customer/i)).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('password123')).toBeInTheDocument();
        expect(screen.getByText(/Confirm Delete/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    test('deletes customer and navigates back when confirm delete button is clicked', () => {
        render(
            <MemoryRouter initialEntries={[`/delete_customer/1`]}>
                <Routes>
                    <Route path="/delete_customer/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        const confirmButton = screen.getByTestId('confirm-delete-button');
        fireEvent.click(confirmButton);
        expect(mockDeleteCustomer).toHaveBeenCalledWith(1);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('cancels delete and navigates back when cancel button is clicked', () => {
        render(
            <MemoryRouter initialEntries={[`/delete_customer/1`]}>
                <Routes>
                    <Route path="/delete_customer/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('shows customer not found message and handles navigation for invalid id', () => {
        render(
            <MemoryRouter initialEntries={[`/delete_customer/999`]}>
                <Routes>
                    <Route path="/delete_customer/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Customer not found/i)).toBeInTheDocument();
        expect(screen.getByText(/Back/i)).toBeInTheDocument();
        
        const backButton = screen.getByText(/Back/i);
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handles non-numeric id parameter', () => {
        render(
            <MemoryRouter initialEntries={[`/delete_customer/abc`]}>
                <Routes>
                    <Route path="/delete_customer/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        
        expect(screen.getByText(/Customer not found/i)).toBeInTheDocument();
    });
});
import './DeleteCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,  MemoryRouter, Route, Routes} from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import DeleteCustomer from './DeleteCustomer.tsx';
import { describe, expect, test, vi } from 'vitest';

const mockCustomers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
        ];
const mockDeleteCustomer = vi.fn();
const mockId = 1;

describe('DeleteCustomer Component', () => {
    test('renders delete customer confirmation with selected customer data', () => {
        const selectedCustomer = mockCustomers.find(c => c.id === mockId);
        render(
            <MemoryRouter initialEntries={[`/delete/${mockId}`]}>
                <Routes>
                    <Route path="/delete/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Confirm Delete/i)).toBeInTheDocument();
        expect(screen.getByText(selectedCustomer.name)).toBeInTheDocument();
    });
    test('cancels delete when you press cancel button', () => {
        render(
            <MemoryRouter initialEntries={[`/delete/${mockId}`]}>
                <Routes>
                    <Route path="/delete/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        expect(window.location.pathname).toBe('/');
    });
    test('deletes customer when you press confirm delete button', () => {
        render(
            <MemoryRouter initialEntries={[`/delete/${mockId}`]}>
                <Routes>
                    <Route path="/delete/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        const confirmButton = screen.getByText(/Confirm Delete/i);
        fireEvent.click(confirmButton);
        expect(mockDeleteCustomer).toHaveBeenCalledWith(mockId);
    });
    test('shows customer not found message for invalid id', () => {
        render(
            <MemoryRouter initialEntries={[`/delete/999`]}>
                <Routes>
                    <Route path="/delete/:id" element={
                        <DeleteCustomer customers={mockCustomers} deleteCustomer={mockDeleteCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(/Customer not found/i)).toBeInTheDocument();
    });
});
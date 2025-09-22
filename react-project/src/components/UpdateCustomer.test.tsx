import './UpdateCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,  MemoryRouter, Route, Routes} from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import UpdateCustomer from './UpdateCustomer.tsx';
import { describe, expect, test, vi } from 'vitest';



const mockCustomers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
        ];
const mockUpdateCustomer = vi.fn();
const mockId = 1;

describe('UpdateCustomer Component', () => {
    test('renders update customer form with selected customer data', () => {
        const selectedCustomer = mockCustomers.find(c => c.id === mockId);
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId(/name-input/i)).toHaveValue(selectedCustomer?.name);
        expect(screen.getByTestId(/email-input/i)).toHaveValue(selectedCustomer?.email);
        expect(screen.getByTestId(/password-input/i)).toHaveValue(selectedCustomer?.password);
    });
    test('cancels update when you press cancel button', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        expect(window.location.pathname).toBe('/');
    });
    test('submits updated customer data', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                <Route path="/update/:id" element={
                    <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />
                } />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Jonny' } });
        fireEvent.submit(screen.getByTestId('update-customer-form'));
        expect(mockUpdateCustomer).toHaveBeenCalledWith({
            id: 1,
            name: 'Jonny',
            email: 'john@example.com',
            password: 'password123'
        });
    });
    test('renders with invalid id (no customer found)', () => {
        render(
            <MemoryRouter initialEntries={['/update/999']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });

    test('submits with changed password', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                <Route path="/update/:id" element={
                    <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />
                } />
                </Routes>
            </MemoryRouter>
        );
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'newpass' } });
        fireEvent.submit(screen.getByTestId('update-customer-form'));
        expect(mockUpdateCustomer).toHaveBeenCalledWith({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'newpass'
        });
    });

    test('renders with empty customers array', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={[]} updateCustomer={mockUpdateCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });
});


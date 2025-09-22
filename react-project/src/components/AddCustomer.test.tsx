import './AddCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,  MemoryRouter, Route, Routes} from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import AddCustomer from './AddCustomer.tsx';
import { describe, expect, test, vi } from 'vitest';



const mockCustomers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
        ];
const mockAddCustomer = vi.fn();
const mockId = 3;

describe('AddCustomer Component', () => {
    test('renders add customer form', () => {
        render(
            <MemoryRouter initialEntries={['/add/3']}>
                <Routes>
                    <Route path="/add/:id" element={
                        <AddCustomer id={mockId} addCustomer={mockAddCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId(/name-input/i)).toHaveValue('');
        expect(screen.getByTestId(/email-input/i)).toHaveValue('');
        expect(screen.getByTestId(/password-input/i)).toHaveValue('');
    });
    test('cancels add when you press cancel button', () => {
        render(
            <MemoryRouter initialEntries={['/add/3']}>
                <Routes>
                    <Route path="/add/:id" element={
                        <AddCustomer id={mockId} addCustomer={mockAddCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        expect(window.location.pathname).toBe('/');
    });
    test('submits add customer data', () => {
        render(
            <MemoryRouter initialEntries={['/add/3']}>
                <Routes>
                <Route path="/add/:id" element={
                    <AddCustomer id={mockId} addCustomer={mockAddCustomer} />
                } />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John' } });
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'newpassword' } });
        fireEvent.submit(screen.getByTestId('add-customer-form'));
        expect(mockAddCustomer).toHaveBeenCalledWith({
            id: 3,
            name: 'John',
            email: 'john@example.com',
            password: 'newpassword'
        });
    });
});


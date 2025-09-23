import './UpdateCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,  MemoryRouter, Route, Routes} from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import UpdateCustomer from './UpdateCustomer.tsx';
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
const mockUpdateCustomer = vi.fn();

describe('UpdateCustomer Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders update customer form with selected customer data', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
        expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
        expect(screen.getByTestId('password-input')).toHaveValue('password123');
    });

    test('handles input changes and form submission', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Updated Name' } });
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'updated@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'newpass' } });
        fireEvent.submit(screen.getByTestId('update-customer-form'));
        
        expect(mockUpdateCustomer).toHaveBeenCalledWith({
            id: 1,
            name: 'Updated Name',
            email: 'updated@example.com',
            password: 'newpass'
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('cancels update when cancel button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/update/1']}>
                <Routes>
                    <Route path="/update/:id" element={
                        <UpdateCustomer customers={mockCustomers} updateCustomer={mockUpdateCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        
        fireEvent.click(screen.getByText(/Cancel/i));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('handles invalid customer id', () => {
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

    test('handles empty customers array', () => {
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


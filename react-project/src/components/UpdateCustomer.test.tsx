import './UpdateCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router,  MemoryRouter, Route, Routes} from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import UpdateCustomer from './UpdateCustomer.tsx';
import { describe, expect, vi } from 'vitest';



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
    });


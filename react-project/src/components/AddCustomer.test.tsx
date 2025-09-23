import './AddCustomer.tsx';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes} from 'react-router-dom';
import AddCustomer from './AddCustomer.tsx';
import { describe, expect, test, vi, beforeEach } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockAddCustomer = vi.fn();
const mockId = 3;

describe('AddCustomer Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders add customer form with empty fields', () => {
        render(
            <MemoryRouter initialEntries={['/add/3']}>
                <Routes>
                    <Route path="/add/:id" element={
                        <AddCustomer id={mockId} addCustomer={mockAddCustomer} />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });

    test('handles input changes and form submission', () => {
        render(
            <MemoryRouter initialEntries={['/add/3']}>
                <Routes>
                    <Route path="/add/:id" element={
                        <AddCustomer id={mockId} addCustomer={mockAddCustomer} />
                    } />
                </Routes>
            </MemoryRouter>
        );

        // Test input changes and form submission
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
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('cancels add when cancel button is clicked', () => {
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
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});


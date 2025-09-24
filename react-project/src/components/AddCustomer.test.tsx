import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCustomer from './AddCustomer';
import { describe, expect, test, vi, beforeEach } from 'vitest';

describe('AddCustomer Component', () => {
    const mockAddCustomer = vi.fn();
    const mockOnCancel = vi.fn();
    const mockId = 3;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders add customer form with empty fields', () => {
        render(
            <AddCustomer 
                id={mockId} 
                addCustomer={mockAddCustomer}
                onCancel={mockOnCancel}
            />
        );

        expect(screen.getAllByText('Add Customer')).toHaveLength(2);
        expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });

    test('handles input changes', () => {
        render(
            <AddCustomer 
                id={mockId} 
                addCustomer={mockAddCustomer}
                onCancel={mockOnCancel}
            />
        );

        const nameInput = screen.getByTestId('name-input');
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');

        fireEvent.change(nameInput, { target: { value: 'John' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(nameInput).toHaveValue('John');
        expect(emailInput).toHaveValue('john@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    test('calls addCustomer with correct data on form submission', () => {
        render(
            <AddCustomer 
                id={mockId} 
                addCustomer={mockAddCustomer}
                onCancel={mockOnCancel}
            />
        );

        // Fill out the form
        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.submit(screen.getByTestId('add-customer-form'));
        
        expect(mockAddCustomer).toHaveBeenCalledWith({
            id: 3,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });
    });

    test('clears form fields after successful submission', () => {
        render(
            <AddCustomer 
                id={mockId} 
                addCustomer={mockAddCustomer}
                onCancel={mockOnCancel}
            />
        );

        // Fill out and submit form
        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
        fireEvent.submit(screen.getByTestId('add-customer-form'));

        // Check that fields are cleared
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });

    test('calls onCancel when cancel button is clicked', () => {
        render(
            <AddCustomer 
                id={mockId} 
                addCustomer={mockAddCustomer}
                onCancel={mockOnCancel}
            />
        );
        
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        
        expect(mockOnCancel).toHaveBeenCalled();
    });
});


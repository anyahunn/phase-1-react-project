import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateCustomer from './UpdateCustomer';
import { describe, expect, test, vi, beforeEach } from 'vitest';

describe('UpdateCustomer Component', () => {
    const mockCustomers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
    ];
    
    const mockUpdateCustomer = vi.fn();
    const mockOnCancel = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders update customer form with selected customer data', () => {
        render(
            <UpdateCustomer 
                customers={mockCustomers} 
                customerId={1}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );

        expect(screen.getAllByText('Update Customer')).toHaveLength(2);
        expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
        expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
        expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
        expect(screen.getByTestId('password-input')).toHaveValue('password123');
    });

    test('handles input changes', () => {
        render(
            <UpdateCustomer 
                customers={mockCustomers} 
                customerId={1}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );

        const nameInput = screen.getByTestId('name-input');
        const emailInput = screen.getByTestId('email-input');
        const passwordInput = screen.getByTestId('password-input');

        fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
        fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

        expect(nameInput).toHaveValue('Updated Name');
        expect(emailInput).toHaveValue('updated@example.com');
        expect(passwordInput).toHaveValue('newpassword');
    });

    test('calls updateCustomer with correct data on form submission', () => {
        render(
            <UpdateCustomer 
                customers={mockCustomers} 
                customerId={1}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );

        // Update the form fields
        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Updated Name' } });
        fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'updated@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'newpassword' } });

        // Submit the form
        fireEvent.submit(screen.getByTestId('update-customer-form'));
        
        expect(mockUpdateCustomer).toHaveBeenCalledWith({
            id: 1,
            name: 'Updated Name',
            email: 'updated@example.com',
            password: 'newpassword'
        });
    });

    test('calls onCancel when cancel button is clicked', () => {
        render(
            <UpdateCustomer 
                customers={mockCustomers} 
                customerId={1}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );
        
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        
        expect(mockOnCancel).toHaveBeenCalled();
    });

    test('handles invalid customer id (shows empty form)', () => {
        render(
            <UpdateCustomer 
                customers={mockCustomers} 
                customerId={999}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );
        
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });

    test('handles empty customers array', () => {
        render(
            <UpdateCustomer 
                customers={[]} 
                customerId={1}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );
        
        expect(screen.getByTestId('name-input')).toHaveValue('');
        expect(screen.getByTestId('email-input')).toHaveValue('');
        expect(screen.getByTestId('password-input')).toHaveValue('');
    });

    test('pre-fills form with correct customer data for second customer', () => {
        render(
            <UpdateCustomer 
                customers={mockCustomers} 
                customerId={2}
                updateCustomer={mockUpdateCustomer}
                onCancel={mockOnCancel}
            />
        );

        expect(screen.getByTestId('name-input')).toHaveValue('Jane Smith');
        expect(screen.getByTestId('email-input')).toHaveValue('jane@example.com');
        expect(screen.getByTestId('password-input')).toHaveValue('password456');
    });
});


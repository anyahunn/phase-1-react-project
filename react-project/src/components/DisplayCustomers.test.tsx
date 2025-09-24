import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisplayCustomers from './DisplayCustomers';
import { beforeAll, describe, expect, test, vi } from 'vitest';

describe('DisplayCustomers Component', () => {
    const mockCustomers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
    ];
    
    const mockAddCustomer = vi.fn();
    const mockUpdateCustomer = vi.fn();
    const mockDeleteCustomer = vi.fn();
    const mockFindHighestId = vi.fn(() => 3);

    beforeAll(() => {
        vi.clearAllMocks();
    });

    test('renders customer list with proper data', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        expect(screen.getByText('Customer List')).toBeInTheDocument();
        expect(screen.getByTestId('customer-table')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('renders customer rows with correct test IDs', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        expect(screen.getByTestId('customer-row-1')).toBeInTheDocument();
        expect(screen.getByTestId('customer-row-2')).toBeInTheDocument();
    });

    test('shows AddCustomer form by default (no customer selected)', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        expect(screen.getAllByText('Add Customer')).toHaveLength(2);
        expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
    });

    test('shows UpdateCustomer form when customer is selected', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        // Click on customer row to select it
        const customerRow = screen.getByTestId('customer-row-1');
        fireEvent.click(customerRow);

        expect(screen.getAllByText('Update Customer')).toHaveLength(2);
        expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
    });

    test('delete button is disabled when no customer selected', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        const deleteButton = screen.getByTestId('delete-customer-button');
        expect(deleteButton).toBeDisabled();
    });

    test('delete button is enabled when customer is selected', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        // Select a customer
        const customerRow = screen.getByTestId('customer-row-1');
        fireEvent.click(customerRow);

        const deleteButton = screen.getByTestId('delete-customer-button');
        expect(deleteButton).toBeEnabled();
    });

    test('calls deleteCustomer when delete button is clicked', () => {
        render(
            <DisplayCustomers 
                customers={mockCustomers}
                addCustomer={mockAddCustomer}
                updateCustomer={mockUpdateCustomer}
                deleteCustomer={mockDeleteCustomer}
                findHighestId={mockFindHighestId}
            />
        );

        // Select a customer
        const customerRow = screen.getByTestId('customer-row-1');
        fireEvent.click(customerRow);

        // Click delete button
        const deleteButton = screen.getByTestId('delete-customer-button');
        fireEvent.click(deleteButton);

        expect(mockDeleteCustomer).toHaveBeenCalledWith(1);
    });
});

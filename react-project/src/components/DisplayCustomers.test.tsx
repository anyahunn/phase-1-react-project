import './DisplayCustomers';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import { beforeAll, describe, expect, test } from 'vitest';

let mockCustomers: string | any[]; 

describe('DisplayCustomers Component', () => {
    beforeAll(() => {
        mockCustomers = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ];
    });
    test('renders customer list', () => {
        render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );

        const customerElements = screen.getAllByTestId(/customer-row-\d+/);
        expect(customerElements).toHaveLength(mockCustomers.length);
        expect(customerElements[0]).toHaveTextContent('John Doe');
        expect(customerElements[1]).toHaveTextContent('Jane Smith');
    });

    test('selects and deselects a customer row', () => {
        render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );

        const firstRow = screen.getByTestId('customer-row-1');
        fireEvent.click(firstRow);
        expect(firstRow).toHaveClass('selected-row');
        fireEvent.click(firstRow);
        expect(firstRow).not.toHaveClass('selected-row');
    });

    test('navigates to add customer when no row is selected', () => {
        const { container } = render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );
        const addButton = screen.getByText('Add Customer');
        expect(addButton).toBeInTheDocument();
        fireEvent.click(addButton);
        expect(window.location.pathname).toBe('/add_customer/3');
    });
    test('navigates to update customer when a row is selected', () => {
        const { container } = render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );
        const firstRow = screen.getByTestId('customer-row-1');
        fireEvent.click(firstRow);
        const addButton = screen.getByText('Update Customer');
        expect(addButton).toBeInTheDocument();
        fireEvent.click(addButton);
        expect(window.location.pathname).toBe('/update_customer/1');
    });

    test('navigates to delete customer when a row is selected', () => {
        const { container } = render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );
        const firstRow = screen.getByTestId('customer-row-1');
        fireEvent.click(firstRow);
        const deleteButton = screen.getByText('Delete Customer');
        expect(deleteButton).toBeInTheDocument();
        fireEvent.click(deleteButton);
        expect(window.location.pathname).toBe('/delete_customer/1');
    });
});

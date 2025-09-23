import './DisplayCustomers';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';
import { beforeAll, describe, expect, test, vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

let mockCustomers: any[]; 

describe('DisplayCustomers Component', () => {
    beforeAll(() => {
        mockCustomers = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ];
        vi.clearAllMocks();
    });

    test('renders customer list and handles row selection', () => {
        render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );

        // Test rendering
        const customerElements = screen.getAllByTestId(/customer-row-\d+/);
        expect(customerElements).toHaveLength(mockCustomers.length);
        expect(customerElements[0]).toHaveTextContent('John Doe');
        expect(customerElements[1]).toHaveTextContent('Jane Smith');

        // Test row selection/deselection
        const firstRow = screen.getByTestId('customer-row-1');
        fireEvent.click(firstRow);
        expect(firstRow).toHaveClass('selected-row');
        fireEvent.click(firstRow);
        expect(firstRow).not.toHaveClass('selected-row');
    });

    test('navigates to add customer when no row is selected', () => {
        render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );
        
        const addButton = screen.getByText('Add Customer');
        fireEvent.click(addButton);
        expect(mockNavigate).toHaveBeenCalledWith('/add_customer/3');
    });

    test('navigates to update and delete customer when row is selected', () => {
        render(
            <Router>
                <DisplayCustomers customers={mockCustomers} customer={null} />
            </Router>
        );
        
        // Select a row
        const firstRow = screen.getByTestId('customer-row-1');
        fireEvent.click(firstRow);
        
        // Test update navigation
        const updateButton = screen.getByText('Update Customer');
        fireEvent.click(updateButton);
        expect(mockNavigate).toHaveBeenCalledWith('/update_customer/1');
        
        // Test delete navigation
        const deleteButton = screen.getByText('Delete Customer');
        fireEvent.click(deleteButton);
        expect(mockNavigate).toHaveBeenCalledWith('/delete_customer/1');
    });
});

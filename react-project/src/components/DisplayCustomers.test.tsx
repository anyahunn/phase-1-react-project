import './DisplayCustomers';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DisplayCustomers from './DisplayCustomers';
import React from 'react';

let mockCustomers; 

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
});

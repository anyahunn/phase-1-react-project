import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { test, expect, describe } from 'vitest';
import App from './App';

describe('App Component', () => {
  test('renders main App component without crashing', () => {
    render(<App />);
    expect(screen.getByText('Customer Management System')).toBeInTheDocument();
  });

  test('renders DisplayCustomers component', () => {
    render(<App />);
    expect(screen.getByText('Customer List')).toBeInTheDocument();
  });

  test('renders initial customers', () => {
    render(<App />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  test('renders delete button', () => {
    render(<App />);
    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
  });

  test('renders add customer form by default (no customer selected)', () => {
    render(<App />);
    expect(screen.getAllByText('Add Customer')).toHaveLength(2);
    expect(screen.getByTestId('add-customer-form')).toBeInTheDocument();
  });

  test('shows update form when customer is selected', () => {
    render(<App />);
    
    // Click on a customer row to select it
    const customerRow = screen.getByTestId('customer-row-1');
    fireEvent.click(customerRow);
    
    // Should now show update customer form
    expect(screen.getAllByText('Update Customer')).toHaveLength(2);
    expect(screen.getByTestId('update-customer-form')).toBeInTheDocument();
  });

  test('customer table is interactive', () => {
    render(<App />);
    
    const customerTable = screen.getByTestId('customer-table');
    expect(customerTable).toBeInTheDocument();
    
    // All customer rows should be present
    expect(screen.getByTestId('customer-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('customer-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('customer-row-3')).toBeInTheDocument();
  });

  test('delete button is disabled when no customer selected', () => {
    render(<App />);
    
    const deleteButton = screen.getByTestId('delete-customer-button');
    expect(deleteButton).toBeDisabled();
  });
});

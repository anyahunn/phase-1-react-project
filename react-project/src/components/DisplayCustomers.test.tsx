import { afterEach, beforeEach, expect, test, vi } from 'vitest';
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DisplayCustomers from './DisplayCustomers';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
      ])
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

test('renders customer list from backend', async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
  expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
});
test('selects and deselects a customer row', async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );
  const firstRowCell = await screen.findByText('John Doe');
  const firstRow = firstRowCell.closest('tr');
  fireEvent.click(firstRow!);
  expect(firstRow).toHaveClass('selected-row');
  fireEvent.click(firstRow!);
  expect(firstRow).not.toHaveClass('selected-row');
});
test('navigates to delete customer page when Delete Customer button is clicked', async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );
  const firstRowCell = await screen.findByText('John Doe');
  const firstRow = firstRowCell.closest('tr');
  fireEvent.click(firstRow!);

  const deleteButton = await screen.findByTestId('delete-customer-btn');
  fireEvent.click(deleteButton);
  expect(mockNavigate).toHaveBeenCalledWith('/delete_customer/1');
});
test('does not navigate when Delete Customer button is clicked without selection', async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );
  const deleteButton = await screen.findByTestId('delete-customer-btn');
  fireEvent.click(deleteButton);
  expect(mockNavigate).not.toHaveBeenCalled();
});


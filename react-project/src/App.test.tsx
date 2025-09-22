/*// src/__tests__/App.test.tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import App from './App.js';

// Mock memdb with an in-memory data store that mirrors your module API
vi.mock('../../ProjectAssets/memdb.js', () => {
  let store = [
    { id: 1, name: 'Alice', email: 'alice@example.com', password: 'p@ss1' },
    { id: 2, name: 'Bob', email: 'bob@example.com', password: 'p@ss2' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', password: 'p@ss3' },
  ];

  return {
    getAll: () => [...store],
    get: (id: number) => store.find((c) => c.id === id) ?? null,
    post: (customer: any) => {
      store.push(customer);
      return customer;
    },
    put: (id: number, customer: any) => {
      const idx = store.findIndex((c) => c.id === id);
      if (idx !== -1) store[idx] = { ...store[idx], ...customer };
      return store[idx] ?? null;
    },
    deleteById: (id: number) => {
      store = store.filter((c) => c.id !== id);
    },
    __reset: (items?: any[]) => {
      store =
        items ??
        [
          { id: 1, name: 'Alice', email: 'alice@example.com', password: 'p@ss1' },
          { id: 2, name: 'Bob', email: 'bob@example.com', password: 'p@ss2' },
          { id: 3, name: 'Charlie', email: 'charlie@example.com', password: 'p@ss3' },
        ];
    },
  };
});

const memdb = await import('../../ProjectAssets/memdb.js');

const renderApp = () => render(<App />);

const getTableBodyRows = () => {
  const table = screen.getByRole('table');
  const tbody = table.querySelector('tbody')!;
  return Array.from(tbody.querySelectorAll('tr'));
};

const getRowByName = (name: string) => {
  const rows = getTableBodyRows();
  const row = rows.find((r) => within(r).queryByText(name));
  if (!row) throw new Error(`Row not found for name: ${name}`);
  return row;
};

describe('Manual Test Scripts (Vitest + RTL)', () => {
  beforeEach(() => {
    // reset mock DB and mount the app at "/"
    (memdb as any).__reset();
    renderApp();
  });

  // 1, 1.1, 1.2
  it('1: displays list of all customers after refresh', () => {
    expect(screen.getByRole('heading', { name: /customer list/i })).toBeInTheDocument();
    const rows = getTableBodyRows();
    expect(rows).toHaveLength(3);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  // 2, 2.1, 2.2
  it('2: shows the label "Customer List" above the list', () => {
    expect(screen.getByRole('heading', { name: /customer list/i })).toBeInTheDocument();
  });

  // 3, 3.1, 3.2, 3.3
  it('3: list shows name/email/password; add form allows entry of all fields', async () => {
    const aliceRow = getRowByName('Alice');
    expect(within(aliceRow).getByText('alice@example.com')).toBeInTheDocument();
    expect(within(aliceRow).getByText('p@ss1')).toBeInTheDocument();

    const addOrUpdateBtn = screen.getByRole('button', { name: /add customer/i });
    await userEvent.click(addOrUpdateBtn);

    // On Add page
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    expect(nameInput.placeholder).toMatch(/name/i);
    expect(emailInput.placeholder).toMatch(/email/i);
    expect(passwordInput.placeholder).toMatch(/password/i);

    await userEvent.type(nameInput, 'Dana');
    await userEvent.type(emailInput, 'dana@example.com');
    await userEvent.type(passwordInput, 'p@ss4');

    expect(nameInput.value).toBe('Dana');
    expect(emailInput.value).toBe('dana@example.com');
    expect(passwordInput.value).toBe('p@ss4');
  });

  // 4, 5, 6 and 5.1-5.6, 6.1
  it('4-6: clicking a row selects/deselects; selected appears bold; form shows/clears data via Update/Cancel flows', async () => {
    const bobRow = getRowByName('Bob');

    // Select
    await userEvent.click(bobRow);
    expect(bobRow.classList.contains('selected-row')).toBe(true);

    // Open update form
    const updateBtn = screen.getByRole('button', { name: /update customer/i });
    await userEvent.click(updateBtn);

    // Form shows selected data
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

    expect(nameInput.value).toBe('Bob');
    expect(emailInput.value).toBe('bob@example.com');
    expect(passwordInput.value).toBe('p@ss2');

    // Cancel returns to list; click same row again to deselect
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    const bobRow2 = getRowByName('Bob');
    await userEvent.click(bobRow2); // select
    expect(bobRow2.classList.contains('selected-row')).toBe(true);

    await userEvent.click(bobRow2); // deselect
    expect(bobRow2.classList.contains('selected-row')).toBe(false);
  });

  // 7, 7.1-7.4
  it('7: form mode shows Add when none selected and Update when selected item is edited', async () => {
    // Add mode: navigate to Add page
    await userEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect(screen.getByRole('heading', { name: /add customer/i })).toBeInTheDocument();

    // Cancel back
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Select and open Update
    await userEvent.click(getRowByName('Alice'));
    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));
    expect(screen.getByRole('heading', { name: /update customer/i })).toBeInTheDocument();

    // Selected item is shown
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('Alice');
  });

  // 8, 8.1
  it('8: update form shows the selected record fields', async () => {
    await userEvent.click(getRowByName('Charlie'));
    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));

    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('Charlie');
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('charlie@example.com');
    expect((screen.getByLabelText(/password/i) as HTMLInputElement).value).toBe('p@ss3');
  });

  // 9, 9.1, 9.2
  it('9: form pages show submit and cancel buttons', async () => {
    // Add
    await userEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();

    // Back and Update
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await userEvent.click(getRowByName('Alice'));
    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));
    expect(screen.getByRole('button', { name: /update customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  // 10, 10.1-10.3.4, 11, 11.1
  it('10-11: deleting a selected record removes it from list and DB; clears selection', async () => {
    // Select Bob
    await userEvent.click(getRowByName('Bob'));
    expect(getRowByName('Bob').classList.contains('selected-row')).toBe(true);

    // Navigate to delete
    const delBtn = screen.getByRole('button', { name: /delete customer/i });
    expect(delBtn).toBeEnabled();
    await userEvent.click(delBtn);

    // Confirm delete
    await userEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    // Back on list: Bob is gone, no selection
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    getTableBodyRows().forEach((r) => expect(r.classList.contains('selected-row')).toBe(false));

    // Confirm via memdb (REST facade)
    expect((memdb as any).get(2)).toBeNull();
  });

  // 12, 12.1-12.4
  it('12: users can modify data in the form; empty fields accept typing; existing fields update', async () => {
    // Add page: typing replaces placeholder (by value)
    await userEvent.click(screen.getByRole('button', { name: /add customer/i }));
    const nameA = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailA = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordA = screen.getByLabelText(/password/i) as HTMLInputElement;

    await userEvent.type(nameA, 'New User');
    await userEvent.type(emailA, 'new@user.test');
    await userEvent.type(passwordA, 'secret');

    expect(nameA.value).toBe('New User');
    expect(emailA.value).toBe('new@user.test');
    expect(passwordA.value).toBe('secret');

    // Update page: change existing values
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await userEvent.click(getRowByName('Alice'));
    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));

    const nameU = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailU = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passU = screen.getByLabelText(/password/i) as HTMLInputElement;

    await userEvent.clear(nameU);
    await userEvent.type(nameU, 'Alice Cooper');
    await userEvent.clear(emailU);
    await userEvent.type(emailU, 'acooper@example.org');
    await userEvent.clear(passU);
    await userEvent.type(passU, 'newpass');

    expect(nameU.value).toBe('Alice Cooper');
    expect(emailU.value).toBe('acooper@example.org');
    expect(passU.value).toBe('newpass');
  });

  // 13, 13.1-13.4.4, 14, 14.1
  it('13-14: saving a modified record updates list, clears selection, and resets form/title', async () => {
    // Select Charlie, open Update
    await userEvent.click(getRowByName('Charlie'));
    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));
    expect(screen.getByRole('heading', { name: /update customer/i })).toBeInTheDocument();

    // Modify email and submit
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'charlie+updated@example.com');

    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));

    // Back on list: updated value visible
    const updatedRow = getRowByName('Charlie');
    expect(within(updatedRow).getByText('charlie+updated@example.com')).toBeInTheDocument();

    // No selected rows
    getTableBodyRows().forEach((r) => expect(r.classList.contains('selected-row')).toBe(false));
  });

  // 15, 15.1-15.2.3, 16, 16.1
  it('15-16: cancel de-selects and form is empty when reopened', async () => {
    await userEvent.click(getRowByName('Alice'));
    await userEvent.click(screen.getByRole('button', { name: /update customer/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // No bold rows
    getTableBodyRows().forEach((r) => expect(r.classList.contains('selected-row')).toBe(false));

    // Reopen Add; fields empty (placeholders present, but we assert values empty)
    await userEvent.click(screen.getByRole('button', { name: /add customer/i }));
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText(/password/i) as HTMLInputElement).value).toBe('');
  });

  // 17, 18, 19
  it('17-19: saving with no selection adds a new record; list updates; no selection after save', async () => {
    // Go to Add
    await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

    // Fill and submit
    await userEvent.type(screen.getByLabelText(/name/i), 'Dana');
    await userEvent.type(screen.getByLabelText(/email/i), 'dana@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'p@ss4');
    await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

    // New row appears
    const newRow = getRowByName('Dana');
    expect(within(newRow).getByText('dana@example.com')).toBeInTheDocument();
    expect(within(newRow).getByText('p@ss4')).toBeInTheDocument();

    // No selection remains
    getTableBodyRows().forEach((r) => expect(r.classList.contains('selected-row')).toBe(false));
  });
});*/
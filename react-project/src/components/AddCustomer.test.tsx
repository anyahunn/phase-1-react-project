// import {render, screen } from '@testing-library/react';
// import {it, expect} from 'vitest';
// import "@testing-library/jest-dom/vitest";
// import App from '../App';
// import AddCustomer from './AddCustomer';

// it("renders", () =>{
//     render(< App />);
//     let element = screen.getByText(/Customer List/);
//     expect(element).toBeInTheDocument();
// })
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom/vitest";
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock memdb
vi.mock('../../../ProjectAssets/memdb.js', () => ({
  post: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import AddCustomer from './AddCustomer';

describe('AddCustomer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
  });

  it('renders the form and cancel button', () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/add customer/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add customer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

//   it('allows user to type in all fields', async () => {
//     render(
//       <MemoryRouter>
//         <AddCustomer />
//       </MemoryRouter>
//     );
//     await userEvent.type(screen.getByLabelText(/name/i), 'Dana');
//     await userEvent.type(screen.getByLabelText(/email/i), 'dana@example.com');
//     await userEvent.type(screen.getByLabelText(/password/i), 'p@ss4');
//     expect(screen.getByLabelText(/name/i)).toHaveValue('Dana');
//     expect(screen.getByLabelText(/email/i)).toHaveValue('dana@example.com');
//     expect(screen.getByLabelText(/password/i)).toHaveValue('p@ss4');
//   });

//   it('calls memdb.post and navigates on submit', async () => {
//     const memdb = await import('../../../ProjectAssets/memdb.js');
//     render(
//       <MemoryRouter>
//         <AddCustomer />
//       </MemoryRouter>
//     );
//     await userEvent.type(screen.getByLabelText(/name/i), 'Dana');
//     await userEvent.type(screen.getByLabelText(/email/i), 'dana@example.com');
//     await userEvent.type(screen.getByLabelText(/password/i), 'p@ss4');
//     await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

//     expect(memdb.post).toHaveBeenCalledWith(
//       expect.objectContaining({
//         name: 'Dana',
//         email: 'dana@example.com',
//         password: 'p@ss4',
//       })
//     );
//     expect(mockNavigate).toHaveBeenCalledWith('/');
//   });

//   it('navigates back when cancel is clicked', async () => {
//     render(
//       <MemoryRouter>
//         <AddCustomer />
//       </MemoryRouter>
//     );
//     await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
//     expect(mockNavigate).toHaveBeenCalledWith('/');
//   });
});
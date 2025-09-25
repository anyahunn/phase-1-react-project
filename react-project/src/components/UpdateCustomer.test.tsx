import { afterEach, beforeEach, expect, test, vi } from "vitest";
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
  };
});
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdateCustomer from "./UpdateCustomer";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        }),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

test("renders customer details from backend", async () => {
  render(
    <MemoryRouter>
      <UpdateCustomer open={true} customerId={1} />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:4000/customers/1");
  });

  expect(await screen.findByDisplayValue("John Doe")).toBeInTheDocument();
  expect(await screen.findByDisplayValue("john@example.com")).toBeInTheDocument();
  expect(await screen.findByDisplayValue("password123")).toBeInTheDocument();
});

test("navigates back on cancel", async () => {
  render(
    <MemoryRouter>
      <UpdateCustomer open={true} customerId={1} />
    </MemoryRouter>
  );

  await screen.findByDisplayValue("John Doe");

  fireEvent.click(screen.getByText("Cancel"));
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("submits updated customer data", async () => {
  render(
    <MemoryRouter>
      <UpdateCustomer open={true} customerId={1} />
    </MemoryRouter>
  );

  await screen.findByDisplayValue("John Doe");

  const nameInput = screen.getByDisplayValue("John Doe");
  fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
  const emailInput = screen.getByDisplayValue("john@example.com");
  fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
  const passwordInput = screen.getByDisplayValue("password123");
  fireEvent.change(passwordInput, { target: { value: "newpassword" } });

  fireEvent.click(screen.getByTestId("submit-button"));

  expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:4000/customers/1",
    expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        password: "newpassword",
      }),
    })
  );
});

test("navigates to delete page when delete button is clicked", async () => {
  render(
    <MemoryRouter>
      <UpdateCustomer open={true} customerId={1} />
    </MemoryRouter>
  );

  await screen.findByDisplayValue("John Doe");

  const deleteButton = screen.getByTestId("delete-customer-btn");
  fireEvent.click(deleteButton);
  expect(mockNavigate).toHaveBeenCalledWith("/delete_customer/1");
});

test("calls onCancel when provided", async () => {
  const mockOnCancel = vi.fn();
  render(
    <MemoryRouter>
      <UpdateCustomer open={true} customerId={1} onCancel={mockOnCancel} />
    </MemoryRouter>
  );

  await screen.findByDisplayValue("John Doe");

  fireEvent.click(screen.getByText("Cancel"));
  expect(mockOnCancel).toHaveBeenCalled();
});

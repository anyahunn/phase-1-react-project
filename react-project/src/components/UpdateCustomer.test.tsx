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
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpdateCustomer from "./UpdateCustomer";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
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
    <MemoryRouter initialEntries={["/update_customer/1"]}>
      <UpdateCustomer />
    </MemoryRouter>
  );
  expect(await screen.findByDisplayValue("John Doe")).toBeInTheDocument();
  expect(await screen.findByDisplayValue("john@example.com")).toBeInTheDocument();
  expect(await screen.findByDisplayValue("password123")).toBeInTheDocument();
});

test("navigates back on cancel", async () => {
  render(
    <MemoryRouter initialEntries={["/update_customer/1"]}>
      <UpdateCustomer />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/");
});

test("submits updated customer data", async () => {
  render(
    <MemoryRouter initialEntries={["/update_customer/1"]}>
      <UpdateCustomer />
    </MemoryRouter>
  );
  const nameInput = await screen.findByDisplayValue("John Doe");
  fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
  const emailInput = await screen.findByDisplayValue("john@example.com");
  fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
  const passwordInput = await screen.findByDisplayValue("password123");
  fireEvent.change(passwordInput, { target: { value: "newpassword" } });

  fireEvent.click(screen.getByRole("button", { name: /update customer/i }));

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

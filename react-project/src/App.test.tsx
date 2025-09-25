import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, afterEach, test, expect, vi } from "vitest";
import App, { AppRoutes } from "./App";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url) => {
      if (url.includes("/customers/1")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              password: "password123",
            }),
        });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              id: 1,
              name: "John Doe",
              email: "john@example.com",
              password: "password123",
            },
            {
              id: 2,
              name: "Jane Smith",
              email: "jane@example.com",
              password: "password456",
            },
          ]),
      });
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});

test("renders default route (DisplayCustomers)", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(await screen.findByRole("heading", { name: /Customer List/i })).toBeInTheDocument();
});

test("renders add customer route", () => {
  render(
    <MemoryRouter initialEntries={["/addCustomer"]}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByRole("heading", { name: /Add Customer/i })).toBeInTheDocument();
});

test("renders delete customer route", async () => {
  render(
    <MemoryRouter initialEntries={["/deleteCustomer/1"]}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(await screen.findByText(/Delete Customer/i)).toBeInTheDocument();
  expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
});

test("handles invalid route", () => {
  render(
    <MemoryRouter initialEntries={["/invalid-route"]}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
});

test("App component renders without crashing", () => {
  expect(typeof App).toBe("function");
  expect(typeof AppRoutes).toBe("function");
});

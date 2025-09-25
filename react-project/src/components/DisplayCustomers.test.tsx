import { afterEach, beforeEach, expect, test, vi } from "vitest";
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DisplayCustomers from "./DisplayCustomers";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
  mockNavigate.mockClear();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: "John Doe", email: "john@example.com", password: "password123" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", password: "password456" },
        ]),
    })
  );
});

afterEach(() => {
  vi.resetAllMocks();
});

test("renders customer list from backend", async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:4000/customers");
  });

  expect(await screen.findByText("John Doe")).toBeInTheDocument();
  expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
});

test("selects and deselects a customer row", async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );

  await screen.findByText("John Doe");

  const firstRow = screen.getByTestId("customer-row-1");
  fireEvent.click(firstRow);
  expect(firstRow).toHaveClass("Mui-selected");

  fireEvent.click(firstRow);
  expect(firstRow).not.toHaveClass("Mui-selected");
});

test("opens update modal when customer row is clicked", async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );

  await screen.findByText("John Doe");

  const firstRow = screen.getByTestId("customer-row-1");
  fireEvent.click(firstRow);

  expect(await screen.findByTestId("delete-customer-btn")).toBeInTheDocument();
});

test("search functionality filters customers", async () => {
  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );

  await screen.findByText("John Doe");

  const searchInput = screen.getByPlaceholderText("Search by ID, name, email, or password...");
  fireEvent.change(searchInput, { target: { value: "Jane" } });

  await waitFor(() => {
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });
  expect(screen.getByText("Jane Smith")).toBeInTheDocument();
});

test("shows no customers message when no data", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );

  render(
    <MemoryRouter>
      <DisplayCustomers />
    </MemoryRouter>
  );

  expect(await screen.findByTestId("no-customers-message")).toBeInTheDocument();
});

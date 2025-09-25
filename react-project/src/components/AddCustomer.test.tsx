import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import AddCustomer from "./AddCustomer";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    )
  );
  mockNavigate.mockClear();
});

afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});

describe("AddCustomer Component", () => {
  it("renders the form and cancel button", () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );

    expect(screen.getByTestId("add-customer-title")).toBeInTheDocument();
    expect(screen.getByTestId("add-customer-form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByTestId("add-customer-submit")).toBeInTheDocument();
  });

  it("allows user to type in all fields", () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "alice@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });

    expect(screen.getByLabelText(/name/i)).toHaveValue("Alice");
    expect(screen.getByLabelText(/email/i)).toHaveValue("alice@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("secret");
  });

  it("calls fetch with correct data and navigates on submit", async () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Bob" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "bob@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "mypassword" },
    });

    fireEvent.click(screen.getByTestId("add-customer-submit"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:4000/customers",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Bob",
            email: "bob@example.com",
            password: "mypassword",
          }),
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("resets form when cancel is clicked", () => {
    render(
      <MemoryRouter>
        <AddCustomer />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/email/i)).toHaveValue("");
    expect(screen.getByLabelText(/password/i)).toHaveValue("");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

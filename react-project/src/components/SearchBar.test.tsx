import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  const mockOnSearch = vi.fn();
  const defaultPlaceholder = "Search customers...";
  const customPlaceholder = "Custom placeholder...";
  const defaultTestId = "search-bar";
  const customTestId = "custom-search-bar";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Check if the main container is rendered
    expect(screen.getByTestId(defaultTestId)).toBeInTheDocument();

    // Check if the input field is rendered - use getByPlaceholderText to find the actual input
    expect(screen.getByPlaceholderText(defaultPlaceholder)).toBeInTheDocument();

    // Clear button should not be visible initially
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} testId={customTestId} />
    );

    expect(screen.getByTestId(customTestId)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("calls onSearch when user types in the input", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    // Get the actual input element by placeholder
    const searchInput = screen.getByPlaceholderText(defaultPlaceholder);
    const searchTerm = "test search";

    fireEvent.change(searchInput, { target: { value: searchTerm } });

    expect(mockOnSearch).toHaveBeenCalledWith(searchTerm);
    expect(searchInput).toHaveValue(searchTerm);
  });

  it("shows clear button when search term is not empty", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(defaultPlaceholder);

    // Type something to make clear button appear
    fireEvent.change(searchInput, { target: { value: "test" } });

    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("hides clear button when search term is empty", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(defaultPlaceholder);

    // Type something then clear it
    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.change(searchInput, { target: { value: "" } });

    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("clears search when clear button is clicked", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(defaultPlaceholder);
    const searchTerm = "test search";

    // Type something
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    // Click clear button
    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    // Check that search is cleared
    expect(searchInput).toHaveValue("");
    expect(mockOnSearch).toHaveBeenCalledWith("");

    // Clear button should disappear after clearing
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("calls onSearch with empty string when cleared multiple times", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(defaultPlaceholder);

    // Type something and clear multiple times
    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.change(searchInput, { target: { value: "" } });
    fireEvent.change(searchInput, { target: { value: "another test" } });

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    // onSearch should have been called with empty string for clear operation
    expect(mockOnSearch).toHaveBeenCalledWith("");
    expect(mockOnSearch).toHaveBeenCalledTimes(4); // 3 changes + 1 clear
  });

  it("handles special characters in search term", () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const searchInput = screen.getByPlaceholderText(defaultPlaceholder);
    const specialSearchTerm = "test@example.com #special$chars";

    fireEvent.change(searchInput, { target: { value: specialSearchTerm } });

    expect(mockOnSearch).toHaveBeenCalledWith(specialSearchTerm);
    expect(searchInput).toHaveValue(specialSearchTerm);
  });
});

import React, { useState } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  testId?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search customers...",
  testId = "search-bar",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="search-container" data-testid={testId}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="search-input"
          data-testid="search-input"
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="clear-button"
            title="Clear search"
            data-testid="clear-search-btn"
            type="button"
          ></button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

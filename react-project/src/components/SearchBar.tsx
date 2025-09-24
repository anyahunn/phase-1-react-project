import React, { useState } from "react";
import { TextField, IconButton, InputAdornment, Paper, Typography } from "@mui/material";

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
    <Paper elevation={0} data-testid={testId} sx={{ mb: 2 }}>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        data-testid="search-input"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchTerm && (
                <IconButton
                  aria-label="clear search"
                  onClick={clearSearch}
                  data-testid="clear-search-btn"
                >
                  <Typography>Clear</Typography>
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
};

export default SearchBar;

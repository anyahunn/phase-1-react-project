import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateCustomer from "./UpdateCustomer";
import SearchBar from "./SearchBar";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Box,
  Paper,
  TableContainer,
} from "@mui/material";

interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
}

const DisplayCustomers: React.FC<{}> = ({}) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | -1>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const buttonText2 = "Delete Customer";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    setIsLoading(true);
    fetch("http://localhost:4000/customers")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch customers: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch customers:", err);
        alert("Unable to load customers. Please check your connection and try again.");
        setCustomers([]);
        setFilteredCustomers([]);
        setIsLoading(false);
      });
  };

  const refreshCustomers = () => {
    fetchCustomers();
    setSelectedCustomer(-1);
    setUpdateModalOpen(false);
  };

  const togglePasswordVisibility = (customerId: number) => {
    setShowPasswords((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  const renderPassword = (customer: Customer) => {
    if (showPasswords[customer.id]) {
      return customer.password;
    }
    return "*".repeat(8);
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();

      return (
        customer.id.toString().includes(searchLower) ||
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.password.toLowerCase().includes(searchLower)
      );
    });

    setFilteredCustomers(filtered);

    if (selectedCustomer !== -1 && !filtered.some((customer) => customer.id === selectedCustomer)) {
      setSelectedCustomer(-1);
    }
  };

  const handleRowClick = (customerId: number) => {
    const isSelected = selectedCustomer === customerId;
    setSelectedCustomer(isSelected ? -1 : customerId);
    if (!isSelected) {
      setUpdateModalOpen(true);
    }
  };

  const handleUpdateCancel = () => {
    setUpdateModalOpen(false);
    setSelectedCustomer(-1);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Customer List
      </Typography>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Search by ID, name, email, or password..."
        testId="customer-search-bar"
      />

      {isLoading && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1" color="text.secondary" data-testid="loading-message">
            Loading customers...
          </Typography>
        </Box>
      )}

      {customers.length === 0 && !isLoading && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body1" color="text.secondary" data-testid="no-customers-message">
            No customers found in the database. Add your first customer using the form below.
          </Typography>
        </Box>
      )}

      {customers.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table data-testid="customer-table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Password</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const isSelected = selectedCustomer === customer.id;
                  const isPasswordVisible = showPasswords[customer.id];

                  return (
                    <TableRow
                      key={customer.id}
                      hover
                      selected={isSelected}
                      data-testid={`customer-row-${customer.id}`}
                      onClick={() => handleRowClick(customer.id)}
                      sx={{
                        cursor: "pointer",
                        ...(isSelected && {
                          "& td": {
                            fontWeight: "bold",
                          },
                        }),
                      }}
                    >
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span>{renderPassword(customer)}</span>

                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasswordVisibility(customer.id);
                            }}
                          >
                            {isPasswordVisible ? "Hide" : "Show"}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredCustomers.length === 0 && customers.length > 0 && (
            <Typography sx={{ mt: 2 }}>
              No customers found matching your search criteria.
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Showing {filteredCustomers.length} of {customers.length} customers
          </Typography>
        </>
      )}

      <UpdateCustomer
        customerId={selectedCustomer}
        onCustomerUpdated={refreshCustomers}
        onCancel={handleUpdateCancel}
        open={updateModalOpen}
      />
    </Box>
  );
};

export default DisplayCustomers;

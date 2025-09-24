import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCustomer from "./AddCustomer";
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
  const buttonText2 = "Delete Customer";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    fetch("http://localhost:4000/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
      })
      .catch((err) => console.error("Failed to fetch customers:", err));
  };

  const refreshCustomers = () => {
    fetchCustomers();
    setSelectedCustomer(-1);
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
              return (
                <TableRow
                  key={customer.id}
                  hover
                  selected={isSelected}
                  data-testid={`customer-row-${customer.id}`}
                  onClick={() => setSelectedCustomer(isSelected ? -1 : customer.id)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.password}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredCustomers.length === 0 && customers.length > 0 && (
        <Typography sx={{ mt: 2 }}>No customers found matching your search criteria.</Typography>
      )}
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        Showing {filteredCustomers.length} of {customers.length} customers
      </Typography>
      {selectedCustomer != -1 && (
        <Button
          variant="contained"
          color="error"
          data-testid="delete-customer-btn"
          onClick={() => {
            if (selectedCustomer != -1) {
              navigate(`/delete_customer/${selectedCustomer}`);
            }
          }}
          disabled={selectedCustomer == -1}
          sx={{ mt: 2 }}
        >
          {buttonText2}
        </Button>
      )}

      <Box sx={{ mt: 3 }}>
        {selectedCustomer != -1 ? (
          <UpdateCustomer
            customerId={selectedCustomer}
            onCustomerUpdated={refreshCustomers}
            onCancel={() => setSelectedCustomer(-1)}
          />
        ) : (
          <AddCustomer onCustomerAdded={refreshCustomers} onCancel={() => {}} />
        )}
      </Box>
    </Box>
  );
};

export default DisplayCustomers;

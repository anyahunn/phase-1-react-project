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
  TablePagination,
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
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
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
      setPage(0);
      return;
    }

    const filtered = customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();

      return (
        customer.id.toString().includes(searchLower) ||
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower)
      );
    });

    setFilteredCustomers(filtered);
    setPage(0);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          <TableContainer component={Paper} sx={{ minHeight: 400 }}>
            <Table data-testid="customer-table" size="medium">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "10%" }}>ID</TableCell>
                  <TableCell sx={{ width: "25%" }}>Name</TableCell>
                  <TableCell sx={{ width: "35%" }}>Email</TableCell>
                  <TableCell sx={{ width: "30%" }}>Password</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((customer) => {
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
                        height: 60,
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {filteredCustomers.length === 0 && customers.length > 0 && (
            <Typography sx={{ mt: 2 }}>
              No customers found matching your search criteria.
            </Typography>
          )}
        </>
      )}
      <Box alignContent={"center"} textAlign="center" sx={{ mt: 3 }}>
        <UpdateCustomer
          customerId={selectedCustomer}
          onCustomerUpdated={refreshCustomers}
          onCancel={handleUpdateCancel}
          open={updateModalOpen}
        />
      </Box>
    </Box>
  );
};

export default DisplayCustomers;

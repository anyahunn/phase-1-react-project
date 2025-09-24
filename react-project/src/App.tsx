import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import { Container, CssBaseline } from "@mui/material";
import DisplayCustomers from "./components/DisplayCustomers";
import AddCustomer from "./components/AddCustomer";
import DeleteCustomer from "./components/DeleteCustomer";
import UpdateCustomer from "./components/UpdateCustomer";

// Extract the routes component for testing
export const AppRoutes = () => (
  <Container maxWidth="md" className="App" sx={{ py: 4 }}>
    <Routes>
      <Route path="/" element={<DisplayCustomers />} />
      <Route path="/add_customer/:id" element={<AddCustomer />} />
      <Route path="/delete_customer/:id" element={<DeleteCustomer />} />
      <Route path="/update_customer/:id" element={<UpdateCustomer />} />
    </Routes>
  </Container>
);

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppRoutes />
    </Router>
  );
}

export default App;

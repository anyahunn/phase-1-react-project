import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { AppBar, Button, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import DisplayCustomers from "./components/DisplayCustomers";
import AddCustomer from "./components/AddCustomer";
import DeleteCustomer from "./components/DeleteCustomer";
import UpdateCustomer from "./components/UpdateCustomer";

// Extract the routes component for testing
export const AppRoutes = () => (
  <>
    <AppBar
      position="fixed"
      color="default"
      elevation={2}
      sx={{ bgcolor: "background.paper", color: "text.primary" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, alignContent: "center" }}>
          Customer Manager
        </Typography>
        <Button component={Link} to="/" variant="text" sx={{ color: "black" }}>
          Customer List
        </Button>
        <Button component={Link} to="/addCustomer" variant="text" sx={{ color: "black" }}>
          Add Customer
        </Button>
      </Toolbar>
    </AppBar>
    <Toolbar />
    <Container maxWidth="md" className="App" sx={{ py: 4 }}>
      <Routes>
        <Route path="/" element={<DisplayCustomers />} />
        <Route path="/addCustomer" element={<AddCustomer />} />
        <Route path="/updateCustomer/:id" element={<UpdateCustomer open={false} />} />
        <Route path="/delete_Customer/:id" element={<DeleteCustomer />} />
      </Routes>
    </Container>
  </>
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

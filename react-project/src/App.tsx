import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { AppBar, Button, Container, CssBaseline, Toolbar, Typography } from "@mui/material";
import DisplayCustomers from "./components/DisplayCustomers";
import AddCustomer from "./components/AddCustomer";
import DeleteCustomer from "./components/DeleteCustomer";
import UpdateCustomer from "./components/UpdateCustomer";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

interface User {
  id: number;
  name: string;
  email: string;
}

// Extract the routes component for testing
export const AppRoutes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <>
      {isAuthenticated && (
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
            {user && (
              <Typography variant="body2" sx={{ mr: 2 }}>
                Welcome, {user.name}
              </Typography>
            )}
            <Button component={Link} to="/" variant="text" sx={{ color: "black" }}>
              Customer List
            </Button>
            <Button component={Link} to="/addCustomer" variant="text" sx={{ color: "black" }}>
              Add Customer
            </Button>
            <Button onClick={handleLogout} variant="outlined" sx={{ ml: 2 }}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
      
      {isAuthenticated && <Toolbar />}
      
      <Container maxWidth="md" className="App" sx={{ py: isAuthenticated ? 4 : 0 }}>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DisplayCustomers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addCustomer" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddCustomer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add_customer/:id" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddCustomer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/delete_customer/:id" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DeleteCustomer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update_customer/:id" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdateCustomer open={false} />
              </ProtectedRoute>
            } 
          />
          {/* Redirect any unknown routes to login if not authenticated, or home if authenticated */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} 
          />
        </Routes>
      </Container>
    </>
  );
};

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppRoutes />
    </Router>
  );
}

export default App;

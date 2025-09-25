import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: (user: { id: number; name: string; email: string }) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check against hardcoded admin credentials only
      const ADMIN_EMAIL = 'admin@admin.com';
      const ADMIN_PASSWORD = 'admin';

      if (
        credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
        credentials.password === ADMIN_PASSWORD
      ) {
        // Login successful - call the success callback with admin user info
        onLoginSuccess({
          id: 1,
          name: 'Administrator',
          email: ADMIN_EMAIL
        });
        navigate('/');
      } else {
        setError('Access denied. Only administrators can log in to this system.');
      }
    } catch (err) {
      setError('Unable to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" data-testid="login-title">
          Admin Login
        </Typography>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Administrator access only - please enter your admin credentials
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} data-testid="login-error">
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} data-testid="login-form">
          <Stack spacing={3}>
            <TextField
              data-testid="email-input"
              type="email"
              label="Email"
              value={credentials.email}
              onChange={handleInputChange('email')}
              required
              fullWidth
              disabled={isLoading}
              autoComplete="email"
            />
            
            <TextField
              data-testid="password-input"
              type="password"
              label="Password"
              value={credentials.password}
              onChange={handleInputChange('password')}
              required
              fullWidth
              disabled={isLoading}
              autoComplete="current-password"
            />

            <Button
              data-testid="login-button"
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || !credentials.email || !credentials.password}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Administrator access required. Contact IT support if you need assistance.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;

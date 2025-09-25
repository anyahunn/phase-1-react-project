# Login System Documentation

## Overview
The Customer Manager app now includes a secure login system that validates users against the existing customer database. Only registered customers can access the application using their email and password.

## Features

### 🔐 **Authentication**
- Email and password-based login
- Validates against existing customers in the database
- Case-insensitive email matching
- Session persistence using localStorage

### 🛡️ **Route Protection**
- All routes are protected and require authentication
- Automatic redirect to login page for unauthenticated users
- Redirect to home page after successful login

### 🎨 **User Interface**
- Clean, responsive login form using Material-UI
- Loading states during authentication
- Error handling with user-friendly messages
- Welcome message with user's name in the header
- Logout functionality

## How It Works

### 1. Login Process
1. User enters email and password on `/login` page
2. App fetches all customers from `http://localhost:4000/customers`
3. Searches for matching email and password
4. If found, stores user info in localStorage and redirects to home
5. If not found, shows error message

### 2. Session Management
- User info stored in localStorage as `currentUser`
- Automatically restores session on page refresh
- Logout clears localStorage and redirects to login

### 3. Route Protection
- `ProtectedRoute` component wraps all protected routes
- Checks authentication state before rendering components
- Redirects to `/login` if user not authenticated

## Components Added

### `Login.tsx`
- Main login form component
- Handles form validation and submission
- Manages loading and error states
- Props: `onLoginSuccess: (user) => void`

### `ProtectedRoute.tsx`
- Higher-order component for route protection
- Props: `children: ReactNode, isAuthenticated: boolean`

### Updated `App.tsx`
- Added authentication state management
- Updated routing to include login and protection
- Added logout functionality in header
- Shows welcome message with user name

## Testing

### Login Component Tests
- Form rendering and validation
- Successful login with valid credentials
- Failed login with invalid credentials
- Network error handling
- Loading states
- Case-insensitive email matching

Run tests with:
```bash
npm test Login.test.tsx
```

## Usage Examples

### Testing the Login System
Use any existing customer from your database:

1. **John Doe**: 
   - Email: `john@example.com`
   - Password: `password123`

2. **Jane Smith**: 
   - Email: `jane@example.com` 
   - Password: `password456`

### For Development
To add test users to your database, you can use the Add Customer functionality or directly add them to your REST API.

## Security Considerations

⚠️ **Important**: This is a basic implementation suitable for development and learning. For production use, consider:

- Implementing proper password hashing (bcrypt)
- Using JWT tokens instead of localStorage
- Adding rate limiting for login attempts
- Implementing proper session management
- Using HTTPS for all communications
- Adding password strength requirements
- Implementing account lockout after failed attempts

## API Requirements

The login system requires your REST API (`http://localhost:4000/customers`) to:
- Support GET requests to fetch all customers
- Return customers with `id`, `name`, `email`, and `password` fields
- Handle CORS if running on different ports

## Customization

### Styling
- Login styles are in `Login.css` with VS Code theme support
- Dark mode compatibility included
- Material-UI components for consistent theming

### Error Messages
- Customize error messages in `Login.tsx`
- Add internationalization support if needed

### Session Duration
- Currently uses localStorage (persists until manually cleared)
- Can be modified to use sessionStorage for session-only persistence
- Can add expiration timestamps for automatic logout

## Troubleshooting

### Common Issues
1. **Login fails with correct credentials**: Check if REST API is running on `http://localhost:4000`
2. **Redirects not working**: Ensure React Router is properly configured
3. **Styles not applying**: Check if CSS files are imported correctly

### Debug Tips
- Check browser Network tab for API calls
- Check browser Application tab for localStorage data
- Use console.log in Login component for debugging authentication flow

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';

// Mock the entire auth service
jest.mock('@/lib/auth', () => ({
  signUp: jest.fn().mockResolvedValue({ success: true }),
  signIn: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock useToast
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('Authentication Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Sign Up Flow', () => {
    it('successfully creates an account and redirects to dashboard', async () => {
      const user = userEvent.setup();
      render(<AuthForm type="sign-up" />);

      // Fill in the form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      // Wait for the redirect
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles sign up errors appropriately', async () => {
      // Mock the sign up to fail
      const authService = require('@/lib/auth');
      authService.signUp.mockRejectedValueOnce(new Error('Email already exists'));

      const user = userEvent.setup();
      render(<AuthForm type="sign-up" />);

      // Fill in the form
      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /sign up/i }));

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('Sign In Flow', () => {
    it('successfully logs in and redirects to dashboard', async () => {
      const user = userEvent.setup();
      render(<AuthForm type="sign-in" />);

      // Fill in the form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'Password123!');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Wait for the redirect
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('handles invalid credentials', async () => {
      // Mock the sign in to fail
      const authService = require('@/lib/auth');
      authService.signIn.mockRejectedValueOnce(new Error('Invalid credentials'));

      const user = userEvent.setup();
      render(<AuthForm type="sign-in" />);

      // Fill in the form
      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'WrongPass123!');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });
});

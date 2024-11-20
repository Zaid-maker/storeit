import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '../AuthForm';
import { createUserAccount, signInAccount } from '@/lib/actions/user.actions';

// Mock the user actions
jest.mock('@/lib/actions/user.actions');

describe('AuthForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the form with email and password inputs', () => {
    render(<AuthForm type="sign-up" />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<AuthForm type="sign-up" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Type invalid email
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, '123');
    fireEvent.click(submitButton);

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password.*characters/i)).toBeInTheDocument();
    });
  });

  it('submits the form with valid data for sign up', async () => {
    const mockCreateUser = jest.mocked(createUserAccount);
    mockCreateUser.mockResolvedValueOnce({ userId: 'mock-user-id' });

    render(<AuthForm type="sign-up" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    // Type valid credentials
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('submits the form with valid data for sign in', async () => {
    const mockSignIn = jest.mocked(signInAccount);
    mockSignIn.mockResolvedValueOnce({ userId: 'mock-user-id' });

    render(<AuthForm type="sign-in" />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Type valid credentials
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});

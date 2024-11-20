import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '../AuthForm';

describe('AuthForm', () => {
  it('renders the form with email and password inputs', () => {
    render(<AuthForm type={'sign-up'} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors for invalid inputs', async () => {
    render(<AuthForm type={'sign-up'} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Type invalid email
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, '123');
    fireEvent.click(submitButton);

    // Wait for validation errors
    const emailError = await screen.findByText(/invalid email/i);
    const passwordError = await screen.findByText(/password.*characters/i);

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(<AuthForm type={'sign-up'} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Type valid credentials
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.click(submitButton);

    // Add assertions based on your form submission behavior
    // For example, check if loading state is shown, or if success message appears
  });
});

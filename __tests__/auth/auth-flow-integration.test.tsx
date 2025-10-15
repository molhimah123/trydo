import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '@/app/auth/signup/page'
import SignInPage from '@/app/auth/signin/page'

// Mock Next.js router
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

// Mock AuthProvider with consistent implementation
const mockSignUp = jest.fn()
const mockSignIn = jest.fn()

jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    loading: false,
    signUp: mockSignUp,
    signIn: mockSignIn,
    signOut: jest.fn().mockResolvedValue({ error: null }),
    resetPassword: jest.fn().mockResolvedValue({ error: null }),
  }),
}))

describe('Complete Auth Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Sign Up Flow', () => {
    it('completes full signup flow with valid data', async () => {
      mockSignUp.mockResolvedValue({ error: null })
      
      render(<SignUpPage />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: 'Create account' })

      // Fill form with valid data
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      // Submit form
      fireEvent.click(submitButton)

      // Should call signUp
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123')
      })
    })

    it('handles signup with existing email', async () => {
      mockSignUp.mockResolvedValue({ 
        error: { message: 'User already registered' } 
      })

      render(<SignUpPage />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: 'Create account' })

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('User already registered')).toBeInTheDocument()
      })
    })
  })

  describe('Sign In Flow', () => {
    it('completes full signin flow with valid credentials', async () => {
      mockSignIn.mockResolvedValue({ error: null })
      
      render(<SignInPage />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: 'Sign in' })

      // Fill form with valid credentials
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })

      // Submit form
      fireEvent.click(submitButton)

      // Should call signIn
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('user@example.com', 'password123')
      })
    })

    it('handles signin with invalid credentials', async () => {
      mockSignIn.mockResolvedValue({ 
        error: { message: 'Invalid login credentials' } 
      })

      render(<SignInPage />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole('button', { name: 'Sign in' })

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid login credentials')).toBeInTheDocument()
      })
    })
  })
})

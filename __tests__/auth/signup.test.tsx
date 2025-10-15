import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '@/app/auth/signup/page'

// Mock AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    signUp: jest.fn().mockImplementation((email, password) => {
      if (!email || !password) {
        return Promise.resolve({ error: { message: 'Please fill in all fields' } })
      }
      if (password.length < 6) {
        return Promise.resolve({ error: { message: 'Password must be at least 6 characters' } })
      }
      return Promise.resolve({ error: null })
    }),
  }),
}))

describe('SignUpPage', () => {
  it('renders sign up form', () => {
    render(<SignUpPage />)
    
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument()
  })

  it('shows validation error for empty fields', async () => {
    render(<SignUpPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Create account' })
    const form = submitButton.closest('form')
    fireEvent.submit(form)
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    render(<SignUpPage />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Create account' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    render(<SignUpPage />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Create account' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Check your email for the confirmation link!')).toBeInTheDocument()
    })
  })
})

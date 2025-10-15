import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import SignInPage from '@/app/auth/signin/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    signIn: jest.fn().mockImplementation((email, password) => {
      if (!email || !password) {
        return Promise.resolve({ error: { message: 'Please fill in all fields' } })
      }
      return Promise.resolve({ error: null })
    }),
  }),
}))

describe('SignInPage', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders sign in form', () => {
    render(<SignInPage />)
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('shows validation error for empty fields', async () => {
    render(<SignInPage />)
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    const form = submitButton.closest('form')
    fireEvent.submit(form)
    
    // The validation happens in the component before calling the auth function
    // So we need to wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('submits form with valid data', async () => {
    render(<SignInPage />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/app')
    })
  })
})

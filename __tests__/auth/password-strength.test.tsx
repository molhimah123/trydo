import { render, screen, fireEvent } from '@testing-library/react'
import SignUpPage from '@/app/auth/signup/page'

// Mock AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    signUp: jest.fn().mockResolvedValue({ error: null }),
  }),
}))

describe('Password Strength Indicator', () => {
  it('shows password strength indicator when password is entered', () => {
    render(<SignUpPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    
    // Initially no indicator should be shown
    expect(screen.queryByText('Password strength:')).not.toBeInTheDocument()

    // Type a password
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // Should show strength indicator
    expect(screen.getByText('Password strength:')).toBeInTheDocument()
    expect(screen.getByText('Fair')).toBeInTheDocument()
  })

  it('shows correct strength for weak password', () => {
    render(<SignUpPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: '123' } })

    expect(screen.getByText('Very Weak')).toBeInTheDocument()
  })

  it('shows correct strength for strong password', () => {
    render(<SignUpPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })

    expect(screen.getByText('Strong')).toBeInTheDocument()
  })

  it('shows password requirements checklist', () => {
    render(<SignUpPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })

    // Should show all requirements
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
    expect(screen.getByText('Lowercase letter')).toBeInTheDocument()
    expect(screen.getByText('Uppercase letter')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
    expect(screen.getByText('Special character')).toBeInTheDocument()
  })

  it('updates checklist as password requirements are met', () => {
    render(<SignUpPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    
    // Start with weak password
    fireEvent.change(passwordInput, { target: { value: 'a' } })
    
    // Only lowercase should be checked
    const lowercaseCheck = screen.getByText('Lowercase letter').closest('div')
    expect(lowercaseCheck).toHaveClass('text-green-600')
    
    // Add uppercase
    fireEvent.change(passwordInput, { target: { value: 'aA' } })
    
    // Both lowercase and uppercase should be checked
    const uppercaseCheck = screen.getByText('Uppercase letter').closest('div')
    expect(uppercaseCheck).toHaveClass('text-green-600')
  })

  it('shows progress bar with correct width', () => {
    render(<SignUpPage />)

    const passwordInput = screen.getByLabelText(/password/i)
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })

    // Strong password should show progress bar
    const progressBar = document.querySelector('.h-2.rounded-full')
    expect(progressBar).toBeInTheDocument()
  })
})

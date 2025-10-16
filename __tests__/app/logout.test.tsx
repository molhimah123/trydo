import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import AppPage from '@/app/app/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com', id: 'test-user-id' },
    loading: false,
    signOut: jest.fn().mockResolvedValue({ error: null }),
  }),
}))

// Mock localStorage and sessionStorage
const localStorageMock = {
  clear: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
const sessionStorageMock = {
  clear: jest.fn(),
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

describe('AppPage - Logout Functionality', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    localStorageMock.clear.mockClear()
    sessionStorageMock.clear.mockClear()
    mockPush.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders logout button', () => {
    render(<AppPage />)

    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument()
  })

  it('shows logout confirmation dialog when sign out is clicked', () => {
    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    expect(screen.getByText('Are you sure you want to sign out? You will need to sign in again to access your account.')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument()
  })

  it('closes dialog when cancel is clicked', async () => {
    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Are you sure you want to sign out? You will need to sign in again to access your account.')).not.toBeInTheDocument()
    })
  })

  it('successfully signs out when confirmed', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        signOut: mockSignOut,
      }),
    }))

    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const confirmButton = screen.getAllByRole('button', { name: 'Sign Out' })[1] // Get the dialog button
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    })
  })

  it('shows loading state during logout', async () => {
    const mockSignOut = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    )
    
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        signOut: mockSignOut,
      }),
    }))

    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const confirmButton = screen.getAllByRole('button', { name: 'Sign Out' })[1] // Get the dialog button
    fireEvent.click(confirmButton)

    expect(screen.getByText('Signing Out...')).toBeInTheDocument()
    expect(confirmButton).toBeDisabled()
  })

  it('shows error message when logout fails', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ 
      error: { message: 'Logout failed' } 
    })
    
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        signOut: mockSignOut,
      }),
    }))

    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const confirmButton = screen.getAllByRole('button', { name: 'Sign Out' })[1] // Get the dialog button
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to sign out. Please try again.')).toBeInTheDocument()
    })
  })

  it('clears localStorage and sessionStorage on successful logout', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        signOut: mockSignOut,
      }),
    }))

    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const confirmButton = screen.getAllByRole('button', { name: 'Sign Out' })[1] // Get the dialog button
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(localStorageMock.clear).toHaveBeenCalled()
      expect(sessionStorageMock.clear).toHaveBeenCalled()
    })
  })

  it('handles unexpected errors during logout', async () => {
    const mockSignOut = jest.fn().mockRejectedValue(new Error('Network error'))
    
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        signOut: mockSignOut,
      }),
    }))

    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const confirmButton = screen.getAllByRole('button', { name: 'Sign Out' })[1] // Get the dialog button
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
    })
  })

  it('disables sign out button during logout process', async () => {
    const mockSignOut = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    )
    
    jest.doMock('@/components/AuthProvider', () => ({
      useAuth: () => ({
        user: { email: 'test@example.com', id: 'test-user-id' },
        loading: false,
        signOut: mockSignOut,
      }),
    }))

    render(<AppPage />)

    const signOutButton = screen.getByRole('button', { name: 'Sign Out' })
    fireEvent.click(signOutButton)

    const confirmButton = screen.getAllByRole('button', { name: 'Sign Out' })[1] // Get the dialog button
    fireEvent.click(confirmButton)

    // Check that the main sign out button is disabled
    expect(signOutButton).toBeDisabled()
  })
})

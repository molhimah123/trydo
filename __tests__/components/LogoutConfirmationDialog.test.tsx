import { render, screen, fireEvent } from '@testing-library/react'
import { LogoutConfirmationDialog } from '@/components/LogoutConfirmationDialog'

describe('LogoutConfirmationDialog', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when isOpen is true', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )

    expect(screen.getByText('Sign Out')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument()
    expect(screen.getByText('You will need to sign in again to access your account.')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )

    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
    expect(screen.queryByText('Are you sure you want to sign out?')).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )

    const confirmButton = screen.getByText('Sign Out')
    fireEvent.click(confirmButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    )

    expect(screen.getByText('Signing Out...')).toBeInTheDocument()
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('disables buttons when isLoading is true', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    )

    const confirmButton = screen.getByText('Signing Out...')
    const cancelButton = screen.getByText('Cancel')

    expect(confirmButton).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('has proper accessibility attributes', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )

    const confirmButton = screen.getByText('Sign Out')
    const cancelButton = screen.getByText('Cancel')

    expect(confirmButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-red-500')
    expect(cancelButton).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-gray-300')
  })

  it('renders logout icon', () => {
    render(
      <LogoutConfirmationDialog
        isOpen={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    )

    // Check for the SVG icon (logout icon)
    const icon = screen.getByRole('img', { hidden: true })
    expect(icon).toBeInTheDocument()
  })
})

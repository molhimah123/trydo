'use client'

import { useAuth } from '@/components/AuthProvider'
import { LogoutConfirmationDialog } from '@/components/LogoutConfirmationDialog'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AppPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  const handleSignOutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleSignOutConfirm = async () => {
    setIsSigningOut(true)
    setSignOutError('')
    
    try {
      const { error } = await signOut()
      if (error) {
        setSignOutError('Failed to sign out. Please try again.')
        setIsSigningOut(false)
        setShowLogoutDialog(false)
        return
      }
      
      // Redirect to sign in page
      router.push('/auth/signin')
    } catch (err) {
      setSignOutError('An unexpected error occurred. Please try again.')
      setIsSigningOut(false)
      setShowLogoutDialog(false)
    }
  }

  const handleSignOutCancel = () => {
    setShowLogoutDialog(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">TryDo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleSignOutClick}
                disabled={isSigningOut}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSigningOut
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {signOutError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{signOutError}</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to TryDo!
              </h2>
              <p className="text-gray-600">
                Your authentication is working. Task management features coming soon!
              </p>
            </div>
          </div>
        </div>
      </main>

      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onConfirm={handleSignOutConfirm}
        onCancel={handleSignOutCancel}
        isLoading={isSigningOut}
      />
    </div>
  )
}

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, name) => {
    try {
      // Validate inputs
      if (!email?.trim()) {
        throw new Error('Email is required.')
      }
      if (!password) {
        throw new Error('Password is required.')
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.')
      }
      if (!name?.trim()) {
        throw new Error('Name is required.')
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim()
          }
        }
      })

      if (error) {
        // Handle specific auth errors
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Please sign in instead.')
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.')
        }
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Sign up error:', error)
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Network error. Please check your internet connection and try again.' 
        }
      }
      
      return { success: false, error: error.message || 'Failed to create account. Please try again.' }
    }
  }

  const signIn = async (email, password) => {
    try {
      // Validate inputs
      if (!email?.trim()) {
        throw new Error('Email is required.')
      }
      if (!password) {
        throw new Error('Password is required.')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        // Handle specific auth errors
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before signing in.')
        }
        throw error
      }

      return { success: true, data }
    } catch (error) {
      console.error('Sign in error:', error)
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Network error. Please check your internet connection and try again.' 
        }
      }
      
      return { success: false, error: error.message || 'Failed to sign in. Please try again.' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Network error. Please check your internet connection.' 
        }
      }
      
      return { success: false, error: error.message || 'Failed to sign out.' }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

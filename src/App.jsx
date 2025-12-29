import { useState } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AddItemPage from './pages/AddItemPage'
import FindItemPage from './pages/FindItemPage'
import StoredItemsPage from './pages/StoredItemsPage'
import ImportantDocumentsPage from './pages/ImportantDocumentsPage'
import AboutPage from './pages/AboutPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home')
  const { user, loading } = useAuth()
  useSmoothScroll()

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show auth pages
  if (!user) {
    return (
      <>
        {currentPage === 'signup' && <SignUpPage onNavigate={setCurrentPage} />}
        {currentPage !== 'signup' && <SignInPage onNavigate={setCurrentPage} />}
      </>
    )
  }

  // Authenticated - show main app
  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'add' && <AddItemPage />}
      {currentPage === 'find' && <FindItemPage />}
      {currentPage === 'stored' && <StoredItemsPage />}
      {currentPage === 'documents' && <ImportantDocumentsPage />}
      {currentPage === 'about' && <AboutPage />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loadingAuth } = useAuth()
  if (loadingAuth) {
    return <div className='flex justify-center items-center h-screen bg-black' >
      Checking authentication...
    </div>
  }
  if(!isLoggedIn) {
    return <Navigate to="/signup" replace />
  }

  return children
}

export default ProtectedRoute;
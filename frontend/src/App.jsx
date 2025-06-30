import React from 'react'
import SignupPage from './pages/SignupPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SigninPage from './pages/SigninPage'
import UrlShortner from './pages/Urlshortner'
import { UrlProvider } from './context/UrlContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import {Analytics} from '@vercel/analytics/react'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <UrlProvider>
            <Routes>
              <Route path='/signup' element={<SignupPage />} />
              <Route path='/signin' element={<SigninPage />} />
              <Route
                path='/'
                element={
                <ProtectedRoute>
                  <UrlShortner />
                </ProtectedRoute>
              } />
            </Routes>
          </UrlProvider>
        </AuthProvider>
      </BrowserRouter>
      <Analytics />
    </>
  )
}

export default App
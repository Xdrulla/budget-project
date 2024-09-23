import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Budget from '../src/components/Budget'
import LoginSection from './Login'
import Register from './Register'
import UserProfile from './components/UserProfile'
import AppMenu from './components/Menu'
import { logout } from './services/auth'
import { Button } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import MonthlyAverageChart from './pages/MonthlyAverageChart'

const App = () => {
  const [user, setUser] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  const toggleRegister = () => {
    setIsRegistering(!isRegistering)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.className = isDarkMode ? 'light-mode' : 'dark-mode'
  }

  useEffect(() => {
    document.documentElement.className = isDarkMode ? 'dark-mode' : 'light-mode'
  }, [isDarkMode])

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <div className="sidebar">
              <AppMenu />
            </div>
            <div className="content">
              <div className="header">
                <UserProfile user={user} onLogout={handleLogout} />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<BulbOutlined />}
                  onClick={toggleTheme}
                  style={{
                    marginLeft: '10px',
                    zIndex: 1000
                  }}
                />
              </div>
              <Routes>
                <Route path="/orcamento" element={<Budget />} />
                <Route path="/media-mensal" element={<MonthlyAverageChart />} />
                <Route path="*" element={<Navigate to="/orcamento" />} />
              </Routes>
            </div>
          </>
        ) : (
          <div className="content">
            {isRegistering ? (
              <Register
                onRegisterSuccess={() => setUser(getAuth().currentUser)}
                toggleLogin={toggleRegister}
              />
            ) : (
              <LoginSection
                onLoginSuccess={() => setUser(getAuth().currentUser)}
                toggleRegister={toggleRegister}
              />
            )}
          </div>
        )}
      </div>
    </Router>
  )
}

export default App

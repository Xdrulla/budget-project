import React, { useState } from 'react'
import { login } from './services/auth'

const LoginSection = ({ onLoginSuccess, toggleRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      onLoginSuccess()
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.')
    }
  }

  return (
    <div className="login-box">
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='off' required/>
          <label>Email</label>
        </div>
        <div className="user-box">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Senha</label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="submit-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Enviar
        </button>
        <button onClick={toggleRegister} className="submit-button">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Não tem uma conta? Registrar
      </button>
      </form>
    </div>
  )
}

export default LoginSection

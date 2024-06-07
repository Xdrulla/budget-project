import React, { useState } from 'react'
import { register } from './services/auth'

const Register = ({ onRegisterSuccess, toggleLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    try {
      await register(email, password)
      onRegisterSuccess()
    } catch (error) {
      setError('Erro ao registrar. Verifique suas credenciais.')
    }
  }

  return (
    <div className="login-box">
      <form onSubmit={handleSubmit}>
        <div className="user-box">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Email</label>
        </div>
        <div className="user-box">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Senha</label>
        </div>
        <div className="user-box">
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <label>Confirme a senha</label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="submit-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Enviar
        </button>
        <button onClick={toggleLogin} className="submit-button">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Já tem uma conta? Login
        </button>
      </form>
    </div>
  )
}

export default Register

import { useDispatch } from "react-redux"
import { login, logout } from "./authSlice"

function AuthForm() {
  const dispatch = useDispatch()
  const handleLogin = () => {
    dispatch(login())
  }
  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="auth-form">
      <h2>Authentication Form</h2>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default AuthForm

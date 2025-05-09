import { useState } from "react"
import { useDispatch } from "react-redux"
import { login, logout } from "./authSlice"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../../firebase"

function AuthForm() {
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    try {
      const email = `${username}@movieapp.local`
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      dispatch(login(userCredential.user.uid))
    } catch (err) {
      console.error("Firebase login failed", err)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      dispatch(logout())
    } catch (err) {
      console.error("Firebase logout failed", err)
    }
  }

  return (
    <div className="auth-form max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 mb-3 border rounded"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
      <button
        onClick={handleLogout}
        className="w-full bg-gray-300 text-gray-800 py-2 mt-2 rounded hover:bg-gray-400"
      >
        Log Out
      </button>
    </div>
  )
}

export default AuthForm

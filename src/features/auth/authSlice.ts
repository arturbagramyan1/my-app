import { createAppSlice } from "../../app/createAppSlice"

interface AuthState {
  isLoggedIn: boolean
  userId: string | null
}

const initialState: AuthState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
  userId: localStorage.getItem("userId"),
}

const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true
      state.userId = action.payload
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userId", action.payload)
    },
    logout: state => {
      state.isLoggedIn = false
      state.userId = null
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userId")
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice

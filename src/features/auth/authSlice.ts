import { createAppSlice } from "../../app/createAppSlice"

interface AuthState {
  isLoggedIn: boolean
}

const initialState: AuthState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || "false"),
}

const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: {
    login: state => {
      state.isLoggedIn = true
      localStorage.setItem("isLoggedIn", "true")
    },
    logout: state => {
      state.isLoggedIn = false
      localStorage.setItem("isLoggedIn", "true")
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice

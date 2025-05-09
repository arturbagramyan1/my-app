import { Navigate, useLocation } from "react-router"
import { useAppSelector } from "../app/hooks"
import type { ReactNode } from "react"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const location = useLocation()

  if (!isLoggedIn && !["/login", "/register"].includes(location.pathname)) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default ProtectedRoute

// localhost:59329/login
//localhost:59329/register

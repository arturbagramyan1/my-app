import { Layout as AntLayout, Menu, Button, theme } from "antd"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  HomeOutlined,
  VideoCameraOutlined,
  HeartOutlined,
  LogoutOutlined,
} from "@ant-design/icons"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { logout } from "../../features/auth/authSlice"
import { signOut } from "firebase/auth"
import { auth } from "../../firebase"
import type { ReactNode } from "react"

const { Header, Content, Footer } = AntLayout

const Layout = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      dispatch(logout())
      navigate("/login")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "/movies",
      icon: <VideoCameraOutlined />,
      label: <Link to="/movies">Movies</Link>,
    },
    {
      key: "/favorites",
      icon: <HeartOutlined />,
      label: <Link to="/favorites">Favorites</Link>,
    },
  ]

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: token.colorBgContainer,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <h1
            style={{
              margin: 0,
              marginRight: 48,
              fontSize: 20,
              fontWeight: 600,
              color: token.colorPrimary,
            }}
          >
            🎬 MovieApp
          </h1>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ flex: 1, border: "none", backgroundColor: "transparent" }}
          />
        </div>
        {isLoggedIn && (
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginLeft: 16 }}
          >
            Logout
          </Button>
        )}
      </Header>

      <Content style={{ padding: "24px", background: "#f0f2f5" }}>
        {children}
      </Content>

      <Footer
        style={{
          textAlign: "center",
          background: token.colorBgContainer,
          color: token.colorTextSecondary,
        }}
      >
        © MovieApp. All rights reserved.
      </Footer>
    </AntLayout>
  )
}

export default Layout

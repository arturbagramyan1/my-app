import { useState } from "react"
import { Typography, Card, Form, Input, Button, Alert, Space } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useAppDispatch } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { login } from "../features/auth/authSlice"

const { Title, Text } = Typography

interface LoginForm {
  username: string
  password: string
}

const LoginPage = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginForm) => {
    setError("")
    setLoading(true)
    const fakeEmail = `${values.username}@movieapp.local`

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        fakeEmail,
        values.password,
      )
      dispatch(login(userCredential.user.uid))
      navigate("/")
    } catch (err: any) {
      setError("Authentication failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "32px 16px",
    }}>
      <Card style={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 8, color: "#141e30" }}>
              Welcome Back 👋
            </Title>
            <Text type="secondary">
              Log in to continue to MovieApp
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
            />
          )}

          <Form
            name="login"
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: 45 }}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Don't have an account?{" "}
              <Button
                type="link"
                onClick={() => navigate("/register")}
                style={{ padding: 0 }}
              >
                Register now
              </Button>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default LoginPage

import { useState } from "react"
import { Typography, Card, Form, Input, Button, Alert, Space } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useAppDispatch } from "../app/hooks"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { login } from "../features/auth/authSlice"

const { Title, Text } = Typography

interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
}

const RegisterPage = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleSubmit = async (values: RegisterForm) => {
    setError("")
    setLoading(true)

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const email = `${values.username}@movieapp.local`

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        values.password,
      )
      dispatch(login(userCredential.user.uid))
      navigate("/")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px 16px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 8, color: "#141e30" }}>
              Create Account ✨
            </Title>
            <Text type="secondary">Join MovieApp to start your journey</Text>
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
            form={form}
            name="register"
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username" },
                { min: 3, message: "Username must be at least 3 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject("Passwords do not match")
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
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
                Register
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Already have an account?{" "}
              <Button
                type="link"
                onClick={() => navigate("/login")}
                style={{ padding: 0 }}
              >
                Log in
              </Button>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default RegisterPage

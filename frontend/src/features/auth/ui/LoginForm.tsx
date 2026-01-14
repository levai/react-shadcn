import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from '@/shared/i18n'
import { useAuthStore } from '../model'
import { authService } from '../api'
import { ROUTES } from '@/shared/constants'

import { Button, Input, Form } from 'antd'

/**
 * 登录表单组件
 */
export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  // 加载多个命名空间：auth 作为默认，common 作为辅助
  const { t } = useTranslation(['auth', 'common'])
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: { username: string; password: string }) => {
    setIsLoading(true)

    try {
      const response = await authService.login(values)

      // 先临时保存 token 到 store，这样后续请求会自动带上 Authorization 头
      // 使用 setState 直接更新状态（Zustand 允许在非组件中这样做）
      useAuthStore.setState({
        accessToken: response.access_token,
        isLoading: false,
      })

      // 登录成功后获取用户信息（此时请求会自动带上 token）
      const user = await authService.getCurrentUser()

      // 保存完整的用户信息和 token
      login(user, response.access_token)

      toast.success(t('messages.loginSuccess'))
      navigate(ROUTES.HOME)
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : t('messages.loginFailed')
      toast.error(errorMessage)
      // 登录失败时清除可能已保存的 token
      useAuthStore.getState().logout()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
      initialValues={{
        username: 'admin',
        password: 'admin123', // 后端默认密码
      }}
      className="w-full max-w-sm"
    >
      <Form.Item
        name="username"
        label={t('form.username')}
        rules={[{ required: true, message: t('form.username') + t('common:required') }]}
      >
        <Input placeholder="请输入名称" disabled={isLoading} />
      </Form.Item>

      <Form.Item
        name="password"
        label={t('form.password')}
        rules={[{ required: true, message: t('form.password') + t('common:required') }]}
      >
        <Input.Password placeholder="请输入密码" disabled={isLoading} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={isLoading}>
          {!isLoading && t('login')}
        </Button>
      </Form.Item>
    </Form>
  )
}

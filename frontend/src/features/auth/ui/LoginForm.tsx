import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from '@/shared/i18n'
import { useAuthStore } from '../model'
import { authService } from '../api'
import { ROUTES } from '@/shared/constants'

import { Button, Input, Label } from '@/shared/ui'
import { Loader2 } from 'lucide-react'

/**
 * 登录表单组件
 */
export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  // 加载多个命名空间：auth 作为默认，common 作为辅助
  const { t } = useTranslation(['auth', 'common'])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: 'admin',
    password: 'admin123', // 后端默认密码
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login(formData)

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
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="username">{t('form.username')}</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          placeholder="请输入名称"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('form.password')}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="请输入密码"
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? t('common:status.loading') : t('login')}
      </Button>
    </form>
  )
}

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
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login(formData)
      const user = await authService.getCurrentUser()
      login(user, response.accessToken)
      toast.success(t('messages.loginSuccess'))
      navigate(ROUTES.HOME)
    } catch {
      toast.error(t('messages.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-sm'>
      <div className='space-y-2'>
        <Label htmlFor='email'>{t('form.email')}</Label>
        <Input
          id='email'
          type='email'
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder='admin@example.com'
          required
          disabled={isLoading}
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>{t('form.password')}</Label>
        <Input
          id='password'
          type='password'
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder='123456'
          required
          disabled={isLoading}
        />
      </div>

      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {isLoading ? t('common:status.loading') : t('login')}
      </Button>
    </form>
  )
}

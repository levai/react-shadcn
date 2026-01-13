import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
      toast.success('登录成功')
      navigate(ROUTES.HOME)
    } catch {
      toast.error('登录失败，请检查用户名和密码')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-sm'>
      <div className='space-y-2'>
        <Label htmlFor='email'>邮箱</Label>
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
        <Label htmlFor='password'>密码</Label>
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
        {isLoading ? '登录中...' : '登录'}
      </Button>
    </form>
  )
}

import { useState, useEffect } from 'react'
import { useTranslation } from '@/shared/i18n'
import type { User, CreateUserRequest, UpdateUserRequest } from '../types'
import { Button, Input, Label } from '@/shared/ui'
import { Loader2 } from 'lucide-react'

interface UserFormProps {
  user?: User | null
  onSubmit: (data: CreateUserRequest | UpdateUserRequest) => Promise<void>
  onCancel: () => void
}

/**
 * 用户表单组件（创建/编辑）
 */
export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const { t } = useTranslation(['common'])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    avatar: '',
  })

  const isEditMode = !!user

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '',
        name: user.name,
        avatar: user.avatar || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEditMode) {
        // 编辑模式：只提交 name 和 avatar
        await onSubmit({
          name: formData.name,
          avatar: formData.avatar || null,
        })
      } else {
        // 创建模式：提交所有字段
        await onSubmit({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          avatar: formData.avatar || null,
        })
      }
    } catch (error) {
      // 错误处理由父组件处理
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditMode && (
        <>
          <div className="space-y-2">
            <Label htmlFor="username">{t('common:username')}</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              required
              minLength={3}
              maxLength={50}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('common:password')}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
        </>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">{t('common:name')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
          minLength={1}
          maxLength={100}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">{t('common:avatarOptional')}</Label>
        <Input
          id="avatar"
          value={formData.avatar}
          onChange={e => setFormData({ ...formData, avatar: e.target.value })}
          disabled={isLoading}
          placeholder={t('common:avatarPlaceholder')}
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('common:actions.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? t('common:actions.update') : t('common:actions.create')}
        </Button>
      </div>
    </form>
  )
}

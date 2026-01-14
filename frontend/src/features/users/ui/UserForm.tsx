import { useEffect } from 'react'
import { useTranslation } from '@/shared/i18n'
import type { User, CreateUserRequest, UpdateUserRequest } from '../types'
import { Form, Input, Button, Space } from 'antd'

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
  const [form] = Form.useForm()
  const isEditMode = !!user

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        name: user.name,
        avatar: user.avatar || '',
      })
    } else {
      form.resetFields()
    }
  }, [user, form])

  const handleSubmit = async (values: CreateUserRequest | UpdateUserRequest) => {
    await onSubmit(values)
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
      {!isEditMode && (
        <>
          <Form.Item
            label={t('common:username')}
            name="username"
            rules={[
              {
                required: true,
                message: t('common:validation.required', { field: t('common:username') }),
              },
              { min: 3, message: t('common:validation.minLength', { min: 3 }) },
              { max: 50, message: t('common:validation.maxLength', { max: 50 }) },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('common:password')}
            name="password"
            rules={[
              {
                required: true,
                message: t('common:validation.required', { field: t('common:password') }),
              },
              { min: 6, message: t('common:validation.minLength', { min: 6 }) },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </>
      )}
      <Form.Item
        label={t('common:name')}
        name="name"
        rules={[
          { required: true, message: t('common:validation.required', { field: t('common:name') }) },
          { min: 1, message: t('common:validation.minLength', { min: 1 }) },
          { max: 100, message: t('common:validation.maxLength', { max: 100 }) },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t('common:avatarOptional')} name="avatar">
        <Input placeholder={t('common:avatarPlaceholder')} />
      </Form.Item>
      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>{t('common:actions.cancel')}</Button>
          <Button type="primary" htmlType="submit">
            {isEditMode ? t('common:actions.update') : t('common:actions.create')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

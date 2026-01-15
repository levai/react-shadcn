import { useState } from 'react'
import { useTranslation } from '@/shared/i18n'
import { useRequest } from '@/shared/hooks'
import { userService } from '@/features/users'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/features/users'
import { UserList, UserForm } from '@/features/users'
import { Card, Modal, Button, Spin, Result, Typography, Space } from 'antd'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

const { Title } = Typography

/**
 * 用户管理页面
 */
export default function UserManagementPage() {
  const { t } = useTranslation(['common'])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [page, setPage] = useState(0)
  const pageSize = 20
  const {
    data: usersData,
    loading,
    error,
    refresh,
  } = useRequest(() => userService.getUsers({ skip: page * pageSize, limit: pageSize }), {
    refreshDeps: [page],
  })

  const handleCreate = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, data as UpdateUserRequest)
        toast.success(t('common:actions.updateSuccess'))
      } else {
        await userService.createUser(data as CreateUserRequest)
        toast.success(t('common:actions.createSuccess'))
      }
      setIsFormOpen(false)
      setEditingUser(null)
      refresh()
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : t('common:actions.operationFailed')
      toast.error(errorMessage)
      throw error // 重新抛出，让表单组件知道提交失败
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <Result
            status="error"
            title={t('common:errorOccurred')}
            subTitle={
              error && typeof error === 'object' && 'message' in error
                ? String(error.message)
                : t('common:actions.operationFailed')
            }
            extra={
              <Button type="primary" onClick={refresh}>
                {t('common:actions.refresh')}
              </Button>
            }
          />
        </Card>
      </div>
    )
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <div className="flex items-center justify-between">
        <Title level={2} className="mb-0">
          {t('common:userManagement')}
        </Title>
        <Button type="primary" icon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          {t('common:actions.createUser')}
        </Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          <UserList
            users={usersData?.items || []}
            onEdit={handleEdit}
            onRefresh={refresh}
            pagination={{
              current: page + 1,
              total: usersData?.total || 0,
              pageSize: pageSize,
              onChange: (newPage: number) => setPage(newPage - 1),
              showTotal: (total: number) => t('common:pagination.total', { total }),
            }}
          />
        </Spin>
      </Card>

      <Modal
        open={isFormOpen}
        onCancel={handleCancel}
        title={editingUser ? t('common:actions.editUser') : t('common:actions.createUser')}
        footer={null}
        destroyOnHidden
      >
        <UserForm user={editingUser} onSubmit={handleSubmit} onCancel={handleCancel} />
      </Modal>
    </Space>
  )
}

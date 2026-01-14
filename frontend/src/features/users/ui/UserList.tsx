import { useState } from 'react'
import { useTranslation } from '@/shared/i18n'
import { userService } from '../api'
import type { User } from '../types'
import { Table, Avatar, Badge, Space, Popconfirm, message, Button, Empty } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { Edit, Trash2, Power, PowerOff } from 'lucide-react'

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onRefresh: () => void
  pagination?: false | TablePaginationConfig
}

/**
 * 用户列表组件
 */
export function UserList({ users, onEdit, onRefresh, pagination = false }: UserListProps) {
  const { t } = useTranslation(['common'])
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleToggleActive = async (user: User) => {
    if (loadingId) return

    setLoadingId(user.id)
    try {
      await userService.toggleUserActive(user.id)
      message.success(
        user.is_active ? t('common:actions.deactivateSuccess') : t('common:actions.activateSuccess')
      )
      onRefresh()
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : t('common:actions.operationFailed')
      message.error(errorMessage)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (user: User) => {
    setLoadingId(user.id)
    try {
      await userService.deleteUser(user.id)
      message.success(t('common:actions.deleteSuccess'))
      onRefresh()
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : t('common:actions.operationFailed')
      message.error(errorMessage)
    } finally {
      setLoadingId(null)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns: ColumnsType<User> = [
    {
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar>{record.name?.[0]?.toUpperCase() || 'U'}</Avatar>
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: t('common:username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('common:statusLabel'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Badge
          status={isActive ? 'success' : 'default'}
          text={isActive ? t('common:status.active') : t('common:inactive')}
        />
      ),
    },
    {
      title: t('common:createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: t('common:actions.label'),
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={
              record.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />
            }
            onClick={() => handleToggleActive(record)}
            loading={loadingId === record.id}
            title={record.is_active ? t('common:actions.deactivate') : t('common:actions.activate')}
          />
          <Button
            type="text"
            icon={<Edit className="h-4 w-4" />}
            onClick={() => onEdit(record)}
            title={t('common:actions.edit')}
          />
          <Popconfirm
            title={t('common:actions.delete')}
            description={t('common:actions.confirmDelete', { name: record.name })}
            onConfirm={() => handleDelete(record)}
            okText={t('common:actions.confirm')}
            cancelText={t('common:actions.cancel')}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 className="h-4 w-4" />}
              loading={loadingId === record.id}
              title={t('common:actions.delete')}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={pagination}
      locale={{
        emptyText: <Empty description={t('common:status.noData')} />,
      }}
    />
  )
}

import { useState } from 'react'
import { useTranslation } from '@/shared/i18n'
import { useRequest } from '@/shared/hooks'
import { userService } from '@/features/users'
import type { User, CreateUserRequest, UpdateUserRequest } from '@/features/users'
import { UserList, UserForm } from '@/features/users'
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/shared/ui'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

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
        <Card className="p-6">
          <div className="text-center text-destructive">{t('common:errorOccurred')}</div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('common:userManagement')}</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('common:actions.createUser')}
        </Button>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">{t('common:loading')}</div>
        ) : (
          <UserList users={usersData?.items || []} onEdit={handleEdit} onRefresh={refresh} />
        )}

        {usersData && usersData.total > pageSize && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {t('common:pagination.total', { total: usersData.total })}
              </div>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      if (page > 0) setPage(page - 1)
                    }}
                    className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {(() => {
                  const totalPages = Math.ceil(usersData.total / pageSize)
                  const currentPage = page + 1
                  const pages: (number | 'ellipsis')[] = []

                  // 生成页码数组
                  if (totalPages <= 7) {
                    // 如果总页数少于等于7页，显示所有页码
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i)
                    }
                  } else {
                    // 总是显示第一页
                    pages.push(1)

                    if (currentPage <= 4) {
                      // 当前页在前4页，显示前5页
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i)
                      }
                      pages.push('ellipsis')
                      pages.push(totalPages)
                    } else if (currentPage >= totalPages - 3) {
                      // 当前页在后4页，显示后5页
                      pages.push('ellipsis')
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i)
                      }
                    } else {
                      // 当前页在中间
                      pages.push('ellipsis')
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i)
                      }
                      pages.push('ellipsis')
                      pages.push(totalPages)
                    }
                  }

                  return pages.map((item, index) => {
                    if (item === 'ellipsis') {
                      // 避免重复的省略号
                      if (index > 0 && pages[index - 1] === 'ellipsis') {
                        return null
                      }
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          onClick={e => {
                            e.preventDefault()
                            setPage(item - 1)
                          }}
                          isActive={currentPage === item}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })
                })()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      if ((page + 1) * pageSize < usersData.total) setPage(page + 1)
                    }}
                    className={
                      (page + 1) * pageSize >= usersData.total
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? t('common:actions.editUser') : t('common:actions.createUser')}
          </h2>
          <UserForm user={editingUser} onSubmit={handleSubmit} onCancel={handleCancel} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

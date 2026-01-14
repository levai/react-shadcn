import { useState } from 'react'
import { useTranslation } from '@/shared/i18n'
import { userService } from '../api'
import type { User } from '../types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Avatar,
  AvatarFallback,
} from '@/shared/ui'
import { Edit, Trash2, Power, PowerOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onRefresh: () => void
}

/**
 * 用户列表组件
 */
export function UserList({ users, onEdit, onRefresh }: UserListProps) {
  const { t } = useTranslation(['common'])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const handleToggleActive = async (user: User) => {
    if (loadingId) return

    setLoadingId(user.id)
    try {
      await userService.toggleUserActive(user.id)
      toast.success(
        user.is_active ? t('common:actions.deactivateSuccess') : t('common:actions.activateSuccess')
      )
      onRefresh()
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : t('common:actions.operationFailed')
      toast.error(errorMessage)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete || loadingId) return

    setLoadingId(userToDelete.id)
    try {
      await userService.deleteUser(userToDelete.id)
      toast.success(t('common:actions.deleteSuccess'))
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      onRefresh()
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : t('common:actions.operationFailed')
      toast.error(errorMessage)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common:name')}</TableHead>
            <TableHead>{t('common:username')}</TableHead>
            <TableHead>{t('common:statusLabel')}</TableHead>
            <TableHead>{t('common:createdAt')}</TableHead>
            <TableHead className="text-right">{t('common:actions.label')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                {t('common:status.noData')}
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.username}</TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'default' : 'secondary'}>
                    {user.is_active ? t('common:status.active') : t('common:inactive')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(user)}
                      disabled={loadingId === user.id}
                      title={
                        user.is_active
                          ? t('common:actions.deactivate')
                          : t('common:actions.activate')
                      }
                    >
                      {loadingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.is_active ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(user)}
                      title={t('common:actions.edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(user)}
                      disabled={loadingId === user.id}
                      title={t('common:actions.delete')}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common:actions.delete')}</DialogTitle>
            <DialogDescription>
              {userToDelete && t('common:actions.confirmDelete', { name: userToDelete.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel} disabled={!!loadingId}>
              {t('common:actions.cancel')}
            </Button>
            <Button
              variant="default"
              onClick={handleDeleteConfirm}
              disabled={!!loadingId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loadingId && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('common:actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

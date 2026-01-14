"""用户服务"""

from typing import Optional
from app.core.exceptions import NotFoundError, ConflictError
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.base_service import BaseService
from app.utils.password import get_password_hash


class UserService(BaseService):
    """用户服务"""

    def get_user_by_username(self, username: str) -> User:
        """根据用户名获取用户"""
        user = self.uow.users.get_by_username(username)
        if not user:
            raise NotFoundError("用户不存在")
        return user

    def get_user_by_id(self, user_id: str) -> User:
        """根据 ID 获取用户"""
        user = self.uow.users.get_by_id(user_id)
        if not user:
            raise NotFoundError("用户不存在")
        return user

    def get_current_user_info(self, user: User) -> UserResponse:
        """获取当前用户信息"""
        return UserResponse.model_validate(user)

    def get_users(
        self, skip: int = 0, limit: int = 100, is_active: Optional[bool] = None
    ) -> tuple[list[UserResponse], int]:
        """获取用户列表"""
        users, total = self.uow.users.get_all(
            skip=skip, limit=limit, is_active=is_active
        )
        return [UserResponse.model_validate(user) for user in users], total

    def create_user(self, user_data: UserCreate) -> UserResponse:
        """创建用户"""
        # 检查用户名是否已存在
        if self.uow.users.is_username_exists(user_data.username):
            raise ConflictError("用户名已存在")

        # 创建用户
        user = User(
            username=user_data.username,
            password_hash=get_password_hash(user_data.password),
            name=user_data.name,
            avatar=user_data.avatar,
            is_active=True,
        )

        self.uow.users.create(user)
        self.uow.commit()

        self.logger.info("创建用户成功", user_id=user.id, username=user.username)
        return UserResponse.model_validate(user)

    def update_user(self, user_id: str, user_data: UserUpdate) -> UserResponse:
        """更新用户"""
        user = self.get_user_by_id(user_id)

        # 更新字段
        if user_data.name is not None:
            user.name = user_data.name
        if user_data.avatar is not None:
            user.avatar = user_data.avatar

        self.uow.users.update(user)
        self.uow.commit()

        self.logger.info("更新用户成功", user_id=user.id, username=user.username)
        return UserResponse.model_validate(user)

    def delete_user(self, user_id: str) -> None:
        """删除用户"""
        user = self.get_user_by_id(user_id)

        self.uow.users.delete(user)
        self.uow.commit()

        self.logger.info("删除用户成功", user_id=user.id, username=user.username)

    def toggle_user_active(self, user_id: str) -> UserResponse:
        """切换用户激活状态"""
        user = self.get_user_by_id(user_id)
        user.is_active = not user.is_active

        self.uow.users.update(user)
        self.uow.commit()

        self.logger.info(
            "切换用户激活状态成功",
            user_id=user.id,
            username=user.username,
            is_active=user.is_active,
        )
        return UserResponse.model_validate(user)

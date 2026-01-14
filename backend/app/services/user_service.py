"""用户服务"""

from app.core.exceptions import NotFoundError
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.base_service import BaseService


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

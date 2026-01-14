"""用户 Repository"""

from typing import Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """用户 Repository"""

    def __init__(self, db: Session):
        super().__init__(db, User)

    def get_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return self.db.query(User).filter(User.username == username).first()

    def get_by_email(self, email: str) -> Optional[User]:
        """根据邮箱获取用户（如果模型有 email 字段）"""
        # 如果 User 模型有 email 字段，可以这样实现
        # return self.db.query(User).filter(User.email == email).first()
        return None

    def is_username_exists(self, username: str) -> bool:
        """检查用户名是否存在"""
        return (
            self.db.query(User).filter(User.username == username).first() is not None
        )

    def get_active_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        """获取活跃用户列表"""
        return (
            self.db.query(User)
            .filter(User.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

"""用户 Repository"""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

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

    def get_all(
        self, skip: int = 0, limit: int = 100, is_active: Optional[bool] = None
    ) -> tuple[list[User], int]:
        """获取用户列表（支持分页和过滤）"""
        query = self.db.query(User)

        # 根据 is_active 过滤
        if is_active is not None:
            query = query.filter(User.is_active == is_active)

        # 获取总数
        total = query.count()

        # 分页查询
        users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()

        return users, total

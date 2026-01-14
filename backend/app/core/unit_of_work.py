"""Unit of Work Pattern - 工作单元模式"""

from typing import Protocol
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.repositories.user_repository import UserRepository


class IUnitOfWork(Protocol):
    """Unit of Work 接口"""

    users: UserRepository

    def commit(self) -> None:
        """提交事务"""
        ...

    def rollback(self) -> None:
        """回滚事务"""
        ...


class UnitOfWork:
    """Unit of Work 实现 - 管理工作单元和事务"""

    def __init__(self, session: Session | None = None):
        """
        初始化 Unit of Work
        
        Args:
            session: 数据库会话（如果为 None，则创建新会话）
        """
        self.session: Session = session or SessionLocal()
        self._users: UserRepository | None = None

    @property
    def users(self) -> UserRepository:
        """获取用户 Repository"""
        if self._users is None:
            self._users = UserRepository(self.session)
        return self._users

    def commit(self) -> None:
        """提交事务"""
        try:
            self.session.commit()
        except Exception:
            self.session.rollback()
            raise

    def rollback(self) -> None:
        """回滚事务"""
        self.session.rollback()

    def close(self) -> None:
        """关闭会话"""
        self.session.close()


from typing import Generator


def get_unit_of_work() -> Generator[IUnitOfWork, None, None]:
    """
    获取 Unit of Work（用于依赖注入）
    
    注意：FastAPI 的依赖注入会自动管理生命周期
    在请求结束时，自动调用 commit() 或 rollback()
    
    Yields:
        IUnitOfWork: Unit of Work 实例
    """
    uow = UnitOfWork()
    try:
        yield uow
        uow.commit()
    except Exception:
        uow.rollback()
        raise
    finally:
        uow.close()

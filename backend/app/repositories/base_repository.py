"""Repository 基类"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(ABC, Generic[ModelType]):
    """Repository 基类"""

    def __init__(self, db: Session, model: type[ModelType]):
        """
        初始化 Repository
        
        Args:
            db: 数据库会话
            model: SQLAlchemy 模型类
        """
        self.db = db
        self.model = model

    def get_by_id(self, id: str) -> Optional[ModelType]:
        """根据 ID 获取实体"""
        return self.db.query(self.model).filter(self.model.id == id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """获取所有实体"""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def create(self, obj: ModelType) -> ModelType:
        """创建实体"""
        self.db.add(obj)
        self.db.flush()
        return obj

    def update(self, obj: ModelType) -> ModelType:
        """更新实体"""
        self.db.flush()
        return obj

    def delete(self, obj: ModelType) -> None:
        """删除实体"""
        self.db.delete(obj)
        self.db.flush()

    def count(self) -> int:
        """获取实体数量"""
        return self.db.query(self.model).count()

    def exists(self, id: str) -> bool:
        """检查实体是否存在"""
        return self.db.query(self.model).filter(self.model.id == id).first() is not None

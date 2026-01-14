"""服务基类"""

from typing import Protocol
from app.core.logging import get_logger
from app.core.unit_of_work import IUnitOfWork


class BaseService:
    """服务基类"""

    def __init__(self, uow: IUnitOfWork):
        """
        初始化服务
        
        Args:
            uow: Unit of Work 实例
        """
        self.uow = uow
        self.logger = get_logger(self.__class__.__name__)

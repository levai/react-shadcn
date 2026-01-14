"""统一响应格式 Schema"""

from typing import Generic, TypeVar, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")


class UnifiedResponse(BaseModel, Generic[T]):
    """
    统一响应格式（业界标准）
    
    所有 API 响应都使用此格式包装：
    - code: HTTP 状态码（200 表示成功，其他表示错误）
    - message: 响应消息（可选）
    - data: 响应数据（可选）
    """

    code: int = Field(..., description="HTTP 状态码（200 表示成功，其他表示错误）")
    message: Optional[str] = Field(None, description="响应消息")
    data: Optional[T] = Field(None, description="响应数据")

    class Config:
        json_schema_extra = {
            "example": {
                "code": 200,
                "message": "操作成功",
                "data": {
                    "id": "123",
                    "name": "示例数据",
                },
            }
        }


class SuccessResponse(BaseModel, Generic[T]):
    """
    成功响应格式（简化版）
    
    用于快速创建成功响应
    """

    code: int = Field(default=200, description="HTTP 状态码")
    message: Optional[str] = Field(None, description="响应消息")
    data: T = Field(..., description="响应数据")

    class Config:
        json_schema_extra = {
            "example": {
                "code": 200,
                "message": "操作成功",
                "data": {},
            }
        }

from datetime import datetime
from pydantic import BaseModel, Field


class UserBase(BaseModel):
    """用户基础模式"""

    username: str = Field(..., min_length=3, max_length=50)
    name: str = Field(..., min_length=1, max_length=100)
    avatar: str | None = None


class UserCreate(UserBase):
    """创建用户模式"""

    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """更新用户模式"""

    name: str | None = Field(None, min_length=1, max_length=100)
    avatar: str | None = None


class UserResponse(UserBase):
    """用户响应模式"""

    id: str
    is_active: bool
    roles: list[str] = []  # 角色列表（兼容前端）
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """登录请求模式"""

    username: str
    password: str


class TokenResponse(BaseModel):
    """Token 响应模式"""

    token: str
    expireTime: int | None = Field(None, alias="expire_time")

    class Config:
        populate_by_name = True  # 允许使用字段名或别名

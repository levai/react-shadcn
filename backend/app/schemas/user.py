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
    """Token 响应模式（业界标准格式）"""

    access_token: str = Field(..., description="访问令牌（JWT）")
    token_type: str = Field(default="Bearer", description="令牌类型")
    expires_in: int | None = Field(None, description="过期时间（秒）")
    refresh_token: str | None = Field(None, description="刷新令牌（可选）")

    class Config:
        populate_by_name = True  # 允许使用字段名或别名



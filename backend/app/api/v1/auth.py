from fastapi import APIRouter, Body, Depends

from app.core.dependencies import (
    get_auth_service,
    get_current_user,
    get_user_service,
)
from app.models.user import User
from app.schemas.user import UserLogin, TokenResponse, UserResponse
from app.core.response import create_success_response
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=TokenResponse, status_code=200)
async def login(
    login_data: UserLogin = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    用户登录
    
    返回 JWT Token（业界标准格式）：
    - access_token: 访问令牌
    - token_type: 令牌类型（Bearer）
    - expires_in: 过期时间（秒）
    - refresh_token: 刷新令牌（可选）
    """
    return auth_service.login(login_data.username, login_data.password)


@router.post("/logout", status_code=200)
async def logout(current_user: User = Depends(get_current_user)):
    """
    用户登出
    
    返回统一响应格式：
    {
        "code": 200,
        "message": "登出成功",
        "data": null
    }
    
    注意：实际应用中可以将 token 加入黑名单
    """
    return create_success_response(data=None, message="登出成功")


@router.get("/me", response_model=UserResponse, status_code=200)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """
    获取当前用户信息
    
    需要认证，返回当前登录用户的详细信息
    """
    return user_service.get_current_user_info(current_user)

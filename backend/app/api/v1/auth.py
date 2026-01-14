from fastapi import APIRouter, Body, Depends

from app.core.dependencies import (
    get_auth_service,
    get_current_user,
    get_user_service,
)
from app.models.user import User
from app.schemas.user import UserLogin, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
):
    """用户登录"""
    return auth_service.login(login_data.username, login_data.password)


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """用户登出"""
    # 实际应用中可以将 token 加入黑名单
    return {"message": "登出成功"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """获取当前用户信息"""
    return user_service.get_current_user_info(current_user)

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, get_user_service
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["用户"])


@router.get("/me", response_model=UserResponse, status_code=200)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """
    获取当前用户信息（兼容前端 API 路径）
    
    需要认证，返回当前登录用户的详细信息
    此端点与 /auth/me 功能相同，用于兼容前端 API 路径
    """
    return user_service.get_current_user_info(current_user)

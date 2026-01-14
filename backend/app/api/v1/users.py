from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, get_user_service
from app.models.user import User
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["用户"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """获取当前用户信息（兼容前端 API 路径）"""
    return user_service.get_current_user_info(current_user)

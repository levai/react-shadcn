from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_user, get_user_service
from app.core.response import create_success_response
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["用户"])


@router.get("/me", status_code=200)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    """
    获取当前用户信息（兼容前端 API 路径）
    
    需要认证，返回当前登录用户的详细信息
    此端点与 /auth/me 功能相同，用于兼容前端 API 路径
    """
    user_response = user_service.get_current_user_info(current_user)
    return create_success_response(
        data=user_response.model_dump(mode='json'),
        message="获取用户信息成功",
    )


@router.get("", status_code=200)
async def get_users(
    skip: int = Query(0, ge=0, description="跳过记录数"),
    limit: int = Query(100, ge=1, le=1000, description="返回记录数"),
    is_active: Optional[bool] = Query(None, description="是否激活（过滤条件）"),
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    获取用户列表
    
    需要认证，支持分页和过滤
    """
    users, total = user_service.get_users(skip=skip, limit=limit, is_active=is_active)
    # 将 Pydantic 模型列表转换为字典列表（使用 mode='json' 确保 datetime 正确序列化）
    users_dict = [user.model_dump(mode='json') for user in users]
    return create_success_response(
        data={"items": users_dict, "total": total, "skip": skip, "limit": limit},
        message="获取用户列表成功",
    )


@router.get("/{user_id}", status_code=200)
async def get_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    根据 ID 获取用户信息
    
    需要认证
    """
    user = user_service.get_user_by_id(user_id)
    user_response = UserResponse.model_validate(user)
    return create_success_response(
        data=user_response.model_dump(mode='json'),
        message="获取用户信息成功",
    )


@router.post("", status_code=201)
async def create_user(
    user_data: UserCreate,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    创建新用户
    
    需要认证
    """
    user_response = user_service.create_user(user_data)
    return create_success_response(
        data=user_response.model_dump(mode='json'),
        message="创建用户成功",
        status_code=201,
    )


@router.put("/{user_id}", status_code=200)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    更新用户信息
    
    需要认证
    """
    user_response = user_service.update_user(user_id, user_data)
    return create_success_response(
        data=user_response.model_dump(mode='json'),
        message="更新用户成功",
    )


@router.delete("/{user_id}", status_code=200)
async def delete_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    删除用户
    
    需要认证
    """
    user_service.delete_user(user_id)
    return create_success_response(data=None, message="删除用户成功")


@router.patch("/{user_id}/toggle-active", status_code=200)
async def toggle_user_active(
    user_id: str,
    user_service: UserService = Depends(get_user_service),
    current_user: User = Depends(get_current_user),
):
    """
    切换用户激活状态
    
    需要认证
    """
    user_response = user_service.toggle_user_active(user_id)
    return create_success_response(
        data=user_response.model_dump(mode='json'),
        message="切换用户激活状态成功",
    )

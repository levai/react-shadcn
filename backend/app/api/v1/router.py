from fastapi import APIRouter

from app.api.v1 import auth, users

api_router = APIRouter()

# 注册认证路由
api_router.include_router(auth.router)

# 注册用户路由
api_router.include_router(users.router)

# 注册其他路由
# api_router.include_router(posts.router)

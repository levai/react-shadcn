"""依赖注入"""

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from app.core.exceptions import AuthenticationError
from app.core.security import verify_token
from app.core.unit_of_work import IUnitOfWork, get_unit_of_work
from app.models.user import User
from app.services.auth_service import AuthService
from app.services.user_service import UserService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_auth_service(uow: IUnitOfWork = Depends(get_unit_of_work)) -> AuthService:
    """
    获取认证服务
    
    Args:
        uow: Unit of Work 实例（通过依赖注入获取）
    
    Returns:
        AuthService 实例
    """
    return AuthService(uow)


def get_user_service(uow: IUnitOfWork = Depends(get_unit_of_work)) -> UserService:
    """
    获取用户服务
    
    Args:
        uow: Unit of Work 实例（通过依赖注入获取）
    
    Returns:
        UserService 实例
    """
    return UserService(uow)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    uow: IUnitOfWork = Depends(get_unit_of_work),
) -> User:
    """
    获取当前用户（依赖注入）
    
    Args:
        token: JWT Token
        uow: Unit of Work 实例（通过依赖注入获取）
    
    Returns:
        当前用户实体
    
    Raises:
        AuthenticationError: 当认证失败时
    """
    payload = verify_token(token)
    if payload is None:
        raise AuthenticationError("无效的认证令牌")

    username: str = payload.get("sub")
    if username is None:
        raise AuthenticationError("无效的认证令牌")

    try:
        user_service = UserService(uow)
        return user_service.get_user_by_username(username)
    except Exception:
        raise AuthenticationError("用户不存在")

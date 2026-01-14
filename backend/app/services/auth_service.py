"""认证服务"""

from datetime import timedelta

from app.core.config import settings
from app.core.exceptions import AuthenticationError, AuthorizationError
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.user import TokenResponse
from app.services.base_service import BaseService
from app.utils.password import verify_password


class AuthService(BaseService):
    """认证服务"""

    def authenticate_user(self, username: str, password: str) -> User:
        """验证用户凭据"""
        user = self.uow.users.get_by_username(username)

        if not user:
            self.logger.warning("登录失败：用户不存在", username=username)
            raise AuthenticationError("用户名或密码错误")

        if not verify_password(password, user.password_hash):
            self.logger.warning("登录失败：密码错误", username=username)
            raise AuthenticationError("用户名或密码错误")

        if not user.is_active:
            self.logger.warning("登录失败：用户已被禁用", username=username)
            raise AuthorizationError("用户已被禁用")

        self.logger.info("用户登录成功", username=username, user_id=user.id)
        return user

    def create_access_token_for_user(self, user: User) -> TokenResponse:
        """为用户创建访问令牌（业界标准格式）"""
        access_token_expires = timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # 业界标准格式：access_token, token_type, expires_in
        return TokenResponse(
            access_token=access_token,
            token_type="Bearer",
            expires_in=int(access_token_expires.total_seconds()),
            refresh_token=None,  # 可选：后续可以实现刷新令牌
        )

    def login(self, username: str, password: str) -> TokenResponse:
        """用户登录"""
        user = self.authenticate_user(username, password)
        return self.create_access_token_for_user(user)

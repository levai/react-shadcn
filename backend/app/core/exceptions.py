"""自定义异常类"""

from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """基础 API 异常类"""

    def __init__(
        self,
        detail: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        error_code: str | None = None,
    ):
        """
        初始化异常

        Args:
            detail: 错误消息（人类可读）
            status_code: HTTP 状态码
            error_code: 错误代码（机器可读，可选）
        """
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code or self._get_default_error_code(status_code)

    def _get_default_error_code(self, status_code: int) -> str:
        """根据状态码生成默认错误代码"""
        code_map = {
            status.HTTP_400_BAD_REQUEST: "BAD_REQUEST",
            status.HTTP_401_UNAUTHORIZED: "UNAUTHORIZED",
            status.HTTP_403_FORBIDDEN: "FORBIDDEN",
            status.HTTP_404_NOT_FOUND: "NOT_FOUND",
            status.HTTP_409_CONFLICT: "CONFLICT",
            status.HTTP_422_UNPROCESSABLE_ENTITY: "VALIDATION_ERROR",
            status.HTTP_500_INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
        }
        return code_map.get(status_code, "UNKNOWN_ERROR")


class AuthenticationError(BaseAPIException):
    """认证错误"""

    def __init__(
        self, detail: str = "认证失败", error_code: str | None = None
    ):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code=error_code or "AUTHENTICATION_ERROR",
        )
        self.headers = {"WWW-Authenticate": "Bearer"}


class AuthorizationError(BaseAPIException):
    """授权错误"""

    def __init__(
        self, detail: str = "权限不足", error_code: str | None = None
    ):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN,
            error_code=error_code or "AUTHORIZATION_ERROR",
        )


class NotFoundError(BaseAPIException):
    """资源未找到错误"""

    def __init__(
        self, detail: str = "资源未找到", error_code: str | None = None
    ):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_404_NOT_FOUND,
            error_code=error_code or "NOT_FOUND",
        )


class ValidationError(BaseAPIException):
    """验证错误"""

    def __init__(
        self, detail: str = "请求参数验证失败", error_code: str | None = None
    ):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code=error_code or "VALIDATION_ERROR",
        )


class ConflictError(BaseAPIException):
    """冲突错误（如资源已存在）"""

    def __init__(
        self, detail: str = "资源冲突", error_code: str | None = None
    ):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_409_CONFLICT,
            error_code=error_code or "CONFLICT",
        )

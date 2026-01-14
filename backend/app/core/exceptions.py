"""自定义异常类"""

from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """基础 API 异常类"""

    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class AuthenticationError(BaseAPIException):
    """认证错误"""

    def __init__(self, detail: str = "认证失败"):
        super().__init__(
            detail=detail, status_code=status.HTTP_401_UNAUTHORIZED
        )
        self.headers = {"WWW-Authenticate": "Bearer"}


class AuthorizationError(BaseAPIException):
    """授权错误"""

    def __init__(self, detail: str = "权限不足"):
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)


class NotFoundError(BaseAPIException):
    """资源未找到错误"""

    def __init__(self, detail: str = "资源未找到"):
        super().__init__(detail=detail, status_code=status.HTTP_404_NOT_FOUND)


class ValidationError(BaseAPIException):
    """验证错误"""

    def __init__(self, detail: str = "请求参数验证失败"):
        super().__init__(detail=detail, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


class ConflictError(BaseAPIException):
    """冲突错误（如资源已存在）"""

    def __init__(self, detail: str = "资源冲突"):
        super().__init__(detail=detail, status_code=status.HTTP_409_CONFLICT)

"""全局异常处理器"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.exceptions import BaseAPIException
from app.core.logging import get_logger

logger = get_logger(__name__)


async def base_api_exception_handler(
    request: Request, exc: BaseAPIException
) -> JSONResponse:
    """
    处理自定义 API 异常
    
    返回统一响应格式：
    {
        "code": 401,  // HTTP 状态码
        "message": "错误消息",
        "data": null
    }
    """
    logger.warning(
        "API 异常",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        error_code=getattr(exc, "error_code", None),
        detail=exc.detail,
    )

    headers = getattr(exc, "headers", None)
    
    # 统一响应格式：code 使用 HTTP 状态码
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,  # 使用 HTTP 状态码
            "message": exc.detail,
            "data": None,
        },
        headers=headers,
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """
    处理请求验证异常
    
    返回统一响应格式：
    {
        "code": 422,  // HTTP 状态码
        "message": "验证错误详情",
        "data": null
    }
    """
    logger.warning(
        "请求验证失败",
        path=request.url.path,
        method=request.method,
        errors=exc.errors(),
    )

    # 格式化验证错误消息
    error_messages = []
    for error in exc.errors():
        field = " -> ".join(str(loc) for loc in error.get("loc", []))
        msg = error.get("msg", "验证失败")
        error_messages.append(f"{field}: {msg}")

    error_message = "; ".join(error_messages) if error_messages else "请求参数验证失败"
    
    # 统一响应格式：code 使用 HTTP 状态码
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "code": status.HTTP_422_UNPROCESSABLE_ENTITY,  # 使用 HTTP 状态码 422
            "message": error_message,
            "data": None,
        },
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """
    处理 HTTP 异常
    
    返回统一响应格式：
    {
        "code": 404,  // HTTP 状态码
        "message": "错误消息",
        "data": null
    }
    """
    logger.warning(
        "HTTP 异常",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        detail=exc.detail,
    )

    # 统一响应格式：code 使用 HTTP 状态码
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,  # 使用 HTTP 状态码
            "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
            "data": None,
        },
        headers=exc.headers,
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    处理通用异常
    
    返回统一响应格式：
    {
        "code": 500,  // HTTP 状态码
        "message": "错误消息",
        "data": null
    }
    """
    logger.error(
        "未处理的异常",
        path=request.url.path,
        method=request.method,
        error=str(exc),
        exc_info=True,
    )

    # 生产环境不暴露详细错误信息
    error_message = "内部服务器错误"
    if settings.DEBUG:
        error_message = f"内部服务器错误: {str(exc)}"

    # 统一响应格式：code 使用 HTTP 状态码
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,  # 使用 HTTP 状态码 500
            "message": error_message,
            "data": None,
        },
    )

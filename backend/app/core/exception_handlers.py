"""全局异常处理器"""

from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import BaseAPIException
from app.core.logging import get_logger

logger = get_logger(__name__)


async def base_api_exception_handler(
    request: Request, exc: BaseAPIException
) -> JSONResponse:
    """处理自定义 API 异常"""
    logger.warning(
        "API 异常",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        detail=exc.detail,
    )

    headers = getattr(exc, "headers", None)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=headers,
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """处理请求验证异常"""
    logger.warning(
        "请求验证失败",
        path=request.url.path,
        method=request.method,
        errors=exc.errors(),
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    """处理 HTTP 异常"""
    logger.warning(
        "HTTP 异常",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        detail=exc.detail,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers,
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """处理通用异常"""
    logger.error(
        "未处理的异常",
        path=request.url.path,
        method=request.method,
        error=str(exc),
        exc_info=True,
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "内部服务器错误"},
    )

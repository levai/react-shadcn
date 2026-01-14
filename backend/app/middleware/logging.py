"""请求日志中间件"""

import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import get_logger

logger = get_logger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    """请求日志中间件"""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求并记录日志"""
        start_time = time.time()

        # 记录请求信息
        logger.info(
            "请求开始",
            method=request.method,
            path=request.url.path,
            client_host=request.client.host if request.client else None,
        )

        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # 记录响应信息
            logger.info(
                "请求完成",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                process_time=f"{process_time:.3f}s",
            )

            # 添加处理时间到响应头
            response.headers["X-Process-Time"] = str(process_time)
            return response

        except Exception as e:
            process_time = time.time() - start_time
            logger.error(
                "请求失败",
                method=request.method,
                path=request.url.path,
                error=str(e),
                process_time=f"{process_time:.3f}s",
                exc_info=True,
            )
            raise

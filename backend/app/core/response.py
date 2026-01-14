"""统一响应格式处理"""

from typing import Any, TypeVar
from fastapi import Response
from fastapi.responses import JSONResponse

from app.schemas.response import UnifiedResponse, SuccessResponse

T = TypeVar("T")


def create_success_response(
    data: T,
    message: str | None = None,
    status_code: int = 200,
) -> JSONResponse:
    """
    创建成功响应（统一格式）
    
    Args:
        data: 响应数据
        message: 响应消息（可选）
        status_code: HTTP 状态码（默认 200）
    
    Returns:
        JSONResponse: 统一格式的成功响应
    
    Example:
        ```python
        return create_success_response(
            data={"id": "123", "name": "用户"},
            message="获取成功"
        )
        # 返回: {"code": 200, "message": "获取成功", "data": {...}}
        ```
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "code": status_code,  # 使用 HTTP 状态码
            "message": message,
            "data": data,
        },
    )


def create_error_response(
    message: str,
    status_code: int = 400,
) -> JSONResponse:
    """
    创建错误响应（统一格式）
    
    Args:
        message: 错误消息
        status_code: HTTP 状态码（code 字段会自动使用此值）
    
    Returns:
        JSONResponse: 统一格式的错误响应
    
    Example:
        ```python
        return create_error_response(
            message="资源不存在",
            status_code=404
        )
        # 返回: {"code": 404, "message": "资源不存在", "data": null}
        ```
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "code": status_code,  # 使用 HTTP 状态码
            "message": message,
            "data": None,
        },
    )

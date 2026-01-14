from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.database import Base, engine
from app.core.exception_handlers import (
    base_api_exception_handler,
    general_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from app.core.exceptions import BaseAPIException
from app.core.logging import setup_logging
from app.middleware.logging import LoggingMiddleware

# 初始化日志
setup_logging(log_level=settings.LOG_LEVEL)

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# 添加中间件
app.add_middleware(LoggingMiddleware)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册异常处理器
app.add_exception_handler(BaseAPIException, base_api_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)


@app.get("/")
async def root():
    """根路径"""
    return {"message": "Welcome to FastAPI Backend", "version": settings.APP_VERSION}


@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "ok"}


# 导入路由
from app.api.v1.router import api_router

app.include_router(api_router, prefix="/api/v1")

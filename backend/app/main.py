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
from app.core.logging import get_logger, setup_logging
from app.middleware.logging import LoggingMiddleware

# 初始化日志
setup_logging(log_level=settings.LOG_LEVEL)
logger = get_logger(__name__)

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
# 注意：如果使用通配符 ["*"]，allow_credentials 必须为 False
# 开发环境使用通配符方便测试，生产环境必须明确指定域名
cors_origins = settings.CORS_ORIGINS
allow_credentials = True

# 如果使用通配符，禁用 credentials（开发环境）
# JWT Token 通过 Authorization header 传递，不依赖 credentials，所以可以安全禁用
if cors_origins == ["*"]:
    allow_credentials = False
    if settings.DEBUG:
        logger.info("CORS: 使用通配符模式，allow_credentials 已自动禁用（开发环境）")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
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

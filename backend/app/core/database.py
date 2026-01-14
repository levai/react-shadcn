from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# 数据库 URL（默认使用 SQLite，生产环境建议使用 PostgreSQL 或 MySQL）
DATABASE_URL = getattr(settings, "DATABASE_URL", "sqlite:///./app.db")

# 创建数据库引擎
# SQLite 需要特殊配置，其他数据库（PostgreSQL、MySQL）使用默认配置
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
elif "mysql" in DATABASE_URL:
    # MySQL 推荐配置
    connect_args = {
        "charset": "utf8mb4",
        "connect_timeout": 10,
    }

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=settings.DEBUG,  # 开发环境打印 SQL
    pool_pre_ping=True,  # 连接池预检查（生产环境推荐）
    pool_recycle=3600,    # 连接回收时间（秒）
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 声明基类
Base = declarative_base()


def get_db():
    """获取数据库会话（依赖注入）"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

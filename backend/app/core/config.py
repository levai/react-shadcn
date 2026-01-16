from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """应用配置"""

    # 应用配置
    APP_NAME: str = "FastAPI Backend"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True

    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 3000

    # CORS 配置（支持字符串或列表）
    # 开发环境：可以使用 "*" 允许所有源（但会禁用 credentials）
    # 生产环境：必须明确指定允许的域名
    # 默认：开发环境使用通配符，生产环境需要明确配置
    CORS_ORIGINS: str | list[str] = "*"

    # 数据库配置
    DATABASE_URL: str = "sqlite:///./app.db"

    # JWT 配置
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 日志配置
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        """解析 CORS_ORIGINS，支持字符串或列表格式"""
        if isinstance(v, str):
            # 如果是通配符 "*"，直接返回（用于开发环境）
            if v.strip() == "*":
                return ["*"]
            # 否则解析为列表
            origins = [origin.strip() for origin in v.split(",") if origin.strip()]
            return origins if origins else ["*"]  # 空字符串时默认使用通配符
        return v if isinstance(v, list) else ["*"]


settings = Settings()

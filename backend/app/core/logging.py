"""日志配置"""

import logging
import sys

import structlog


def setup_logging(log_level: str = "INFO") -> None:
    """配置结构化日志"""

    # 配置标准库 logging
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )

    # 配置 structlog
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,  # 合并上下文变量
            structlog.processors.add_log_level,  # 添加日志级别
            structlog.processors.StackInfoRenderer(),  # 堆栈信息
            structlog.processors.format_exc_info,  # 异常信息
            structlog.processors.TimeStamper(fmt="iso"),  # ISO 时间戳
            structlog.processors.JSONRenderer()  # JSON 格式输出
            if not sys.stdout.isatty()
            else structlog.dev.ConsoleRenderer(),  # 开发环境彩色输出
        ],
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, log_level.upper())
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str) -> structlog.BoundLogger:
    """获取日志记录器"""
    return structlog.get_logger(name)

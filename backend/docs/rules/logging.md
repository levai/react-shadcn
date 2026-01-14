# 日志记录规范

## 日志系统

项目使用 `structlog` 实现结构化日志。

**特点：**
- ✅ 结构化日志（JSON 格式）
- ✅ 开发环境彩色输出
- ✅ 生产环境 JSON 格式
- ✅ 自动添加时间戳、日志级别
- ✅ 支持上下文变量

## 日志配置

位置：`app/core/logging.py`

```python
from app.core.logging import setup_logging, get_logger

# 初始化日志（在 main.py 中）
setup_logging(log_level="INFO")

# 获取日志记录器
logger = get_logger(__name__)
```

## 日志级别

| 级别 | 使用场景 |
|------|---------|
| `DEBUG` | 详细的调试信息 |
| `INFO` | 一般信息（操作成功、状态变化） |
| `WARNING` | 警告信息（可恢复的错误） |
| `ERROR` | 错误信息（需要关注的问题） |
| `CRITICAL` | 严重错误（系统无法继续） |

## 在服务层使用日志

### 基本用法

```python
from app.services.base_service import BaseService

class MyService(BaseService):
    def some_method(self):
        # 使用 self.logger（继承自 BaseService）
        self.logger.info("操作开始")
        self.logger.error("操作失败", error=str(e))
```

### 记录信息日志

```python
def create_user(self, data: UserCreate) -> User:
    """创建用户"""
    self.logger.info("开始创建用户", username=data.username)
    
    user = User(...)
    self.db.add(user)
    self.db.commit()
    
    self.logger.info("用户创建成功", user_id=user.id, username=user.username)
    return user
```

### 记录错误日志

```python
def create_user(self, data: UserCreate) -> User:
    """创建用户"""
    try:
        user = User(...)
        self.db.add(user)
        self.db.commit()
        
        self.logger.info("用户创建成功", user_id=user.id)
        return user
    except Exception as e:
        self.logger.error(
            "用户创建失败",
            username=data.username,
            error=str(e),
            exc_info=True,  # 记录堆栈信息
        )
        self.db.rollback()
        raise
```

### 记录警告日志

```python
def authenticate_user(self, username: str, password: str) -> User:
    """验证用户"""
    user = self.uow.users.get_by_username(username)  # ✅ 通过 Repository
    
    if not user:
        self.logger.warning("登录失败：用户不存在", username=username)
        raise AuthenticationError("用户名或密码错误")
    
    if not verify_password(password, user.password_hash):
        self.logger.warning("登录失败：密码错误", username=username)
        raise AuthenticationError("用户名或密码错误")
    
    self.logger.info("用户登录成功", username=username, user_id=user.id)
    return user
```

## 日志字段

### 常用字段

- `user_id` - 用户 ID
- `username` - 用户名
- `operation` - 操作名称
- `error` - 错误信息
- `status` - 状态
- `duration` - 耗时

### 示例

```python
# 操作开始
self.logger.info("操作开始", operation="create_user", username=data.username)

# 操作成功
self.logger.info(
    "操作成功",
    operation="create_user",
    user_id=user.id,
    duration="0.123s"
)

# 操作失败
self.logger.error(
    "操作失败",
    operation="create_user",
    username=data.username,
    error=str(e),
    exc_info=True
)
```

## 请求日志中间件

位置：`app/middleware/logging.py`

请求日志中间件会自动记录：
- 请求方法、路径
- 客户端 IP
- 响应状态码
- 处理时间

**示例输出：**

```
INFO: 请求开始 method=POST path=/api/v1/auth/login client_host=127.0.0.1
INFO: 请求完成 method=POST path=/api/v1/auth/login status_code=200 process_time=0.123s
```

## 日志格式

### 开发环境（彩色输出）

```
2024-01-14 15:24:17 [info] 用户登录成功 username=admin user_id=123
```

### 生产环境（JSON 格式）

```json
{
  "event": "用户登录成功",
  "username": "admin",
  "user_id": "123",
  "timestamp": "2024-01-14T15:24:17.123Z",
  "level": "info"
}
```

## 最佳实践

1. **记录关键操作**：记录所有重要的业务操作
2. **包含上下文**：记录相关的上下文信息（user_id, username 等）
3. **错误记录堆栈**：使用 `exc_info=True` 记录异常堆栈
4. **避免敏感信息**：不要记录密码、Token 等敏感信息
5. **结构化日志**：使用键值对而不是字符串拼接

## 常见错误

### ❌ 错误示例

```python
# 错误1：使用 print
def create_user(self, data: UserCreate):
    print(f"创建用户: {data.username}")  # ❌

# 错误2：字符串拼接
self.logger.info(f"用户创建成功: {user.id}")  # ❌

# 错误3：记录敏感信息
self.logger.info("用户登录", password=data.password)  # ❌
```

### ✅ 正确示例

```python
# 正确：使用 logger
self.logger.info("用户创建成功", user_id=user.id, username=user.username)  # ✅

# 正确：结构化日志
self.logger.info(
    "用户登录成功",
    username=user.username,
    user_id=user.id
)  # ✅
```

## 日志配置

在 `.env` 文件中配置日志级别：

```bash
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
```

在 `main.py` 中初始化：

```python
from app.core.logging import setup_logging
from app.core.config import settings

setup_logging(log_level=settings.LOG_LEVEL)
```

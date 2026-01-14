# AI 编程助手统一规范

> 📖 **这是所有 AI 工具的统一规范源文件**
>
> ⚠️ **重要**: 此文件是唯一维护源，其他文件（`.cursor/rules/steering.mdc`）应引用此文件。

本项目使用 **分层架构** 模式，符合 FastAPI 和 Python 后端开发最佳实践。

## 技术栈

- FastAPI 0.128+ (Web 框架)
- SQLAlchemy 2.0.45+ (ORM)
- Pydantic 2.12+ (数据验证)
- Python 3.12+ (编程语言)
- structlog 25.5+ (结构化日志)
- python-jose 3.5+ (JWT 认证)
- Alembic 1.15+ (数据库迁移)
- Uvicorn 0.40+ (ASGI 服务器)

## 目录结构

```
app/
├── api/              # API 路由层（Controller）
│   └── v1/
│       ├── router.py
│       ├── auth.py
│       └── [feature].py
├── services/         # 业务逻辑层（Service）
│   ├── base_service.py
│   ├── auth_service.py
│   └── [feature]_service.py
├── repositories/     # 数据访问层（Repository）⭐
│   ├── base_repository.py
│   ├── user_repository.py
│   └── [feature]_repository.py
├── models/           # 数据模型层（ORM Model）
│   └── [model].py
├── schemas/          # 数据验证层（Schema）
│   └── [schema].py
├── core/             # 核心配置
│   ├── config.py
│   ├── database.py
│   ├── security.py
│   ├── exceptions.py
│   ├── exception_handlers.py
│   ├── logging.py
│   ├── dependencies.py
│   └── unit_of_work.py  # Unit of Work Pattern ⭐
├── middleware/       # 中间件
│   └── logging.py
└── utils/            # 工具函数
    └── password.py
```

## 核心规则

### 分层架构

**必须遵循分层架构原则：**

```
HTTP Request
    ↓
Router (API Layer)      # 只处理 HTTP 请求/响应
    ↓
Service (Business Logic) # 业务逻辑处理
    ↓
Unit of Work            # 事务管理 ⭐
    ↓
Repository              # 数据访问抽象 ⭐
    ↓
Model (ORM)             # 数据库模型
    ↓
Database
```

**各层职责：**

- **API 层**：处理 HTTP 请求、参数验证、响应格式化
- **Service 层**：业务逻辑、数据转换、异常处理
- **Unit of Work 层**：事务管理、协调多个 Repository
- **Repository 层**：数据访问抽象、封装 ORM 操作
- **Model 层**：数据库模型定义（ORM）
- **Schema 层**：请求/响应数据验证

### 导入规则

**必须使用绝对导入，禁止相对路径：**

```python
# ✅ 正确
from app.services.auth_service import AuthService
from app.core.dependencies import get_auth_service
from app.schemas.user import UserResponse

# ❌ 错误
from ..services.auth_service import AuthService
from ...core.dependencies import get_auth_service
```

### 服务层规范

**业务逻辑必须在服务层，禁止在路由层：**

```python
# ✅ 正确：路由层只处理 HTTP
@router.post("/login")
async def login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),
):
    return auth_service.login(login_data.username, login_data.password)

# ❌ 错误：业务逻辑在路由层
@router.post("/login")
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(...).first()  # ❌ 业务逻辑，直接使用 ORM
    if not user:
        raise HTTPException(...)  # ❌ 异常处理
    # ...
```

### 异常处理规范

**必须使用自定义异常类，禁止直接抛出 HTTPException：**

```python
# ✅ 正确：使用自定义异常，通过 Repository 访问数据
from app.core.exceptions import NotFoundError, AuthenticationError

def get_user(self, user_id: str) -> User:
    user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
    if not user:
        raise NotFoundError("用户不存在")
    return user

# ❌ 错误：直接抛出 HTTPException，直接使用 ORM
from fastapi import HTTPException

def get_user(self, user_id: str):
    user = self.db.query(User).filter(User.id == user_id).first()  # ❌ 直接使用 ORM
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")  # ❌
```

### 日志记录规范

**在服务层使用日志，记录关键操作：**

```python
from app.services.base_service import BaseService

class MyService(BaseService):
    def some_method(self):
        self.logger.info("操作开始", user_id=123)
        try:
            # 业务逻辑
            self.logger.info("操作成功", result="ok")
        except Exception as e:
            self.logger.error("操作失败", error=str(e), exc_info=True)
            raise
```

### 依赖注入规范

**服务通过依赖注入获取 Unit of Work，禁止直接实例化：**

```python
# ✅ 正确：使用 Unit of Work
from app.core.dependencies import get_auth_service

@router.post("/login")
async def login(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service),  # ✅ 使用 Unit of Work
):
    return auth_service.login(...)

# ❌ 错误：直接实例化或使用旧的 Session
@router.post("/login")
async def login(login_data: UserLogin, db: Session = Depends(get_db)):
    auth_service = AuthService(db)  # ❌ 直接实例化，使用旧的 Session
    return auth_service.login(...)
```

### Schema 规范

**必须使用 Pydantic Schema 进行数据验证：**

```python
# ✅ 正确
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)

# 在路由中使用
@router.post("/users", response_model=UserResponse)
async def create_user(
    data: UserCreate,  # ✅ 自动验证
    service: UserService = Depends(get_user_service),
):
    return service.create_user(data)
```

### 类型提示规范

**必须使用类型提示，提高代码可读性：**

```python
# ✅ 正确：使用类型提示，通过 Repository 访问
def get_user(self, user_id: str) -> User:
    user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
    if not user:
        raise NotFoundError("用户不存在")
    return user

# ❌ 错误：缺少类型提示，直接使用 ORM
def get_user(self, user_id):  # ❌ 缺少类型提示
    user = self.db.query(User).filter(User.id == user_id).first()  # ❌ 直接使用 ORM
    # 注意：BaseService 不再有 self.db，只有 self.uow
    if not user:
        raise NotFoundError("用户不存在")
    return user
```

## 关键规则总结

1. ✅ 遵循分层架构（Router → Service → Unit of Work → Repository → Model）
2. ✅ 业务逻辑在服务层，路由层只处理 HTTP
3. ✅ 使用 Repository Pattern，禁止服务层直接使用 ORM
4. ✅ 使用 Unit of Work Pattern 管理事务
5. ✅ 使用自定义异常类，禁止直接抛出 HTTPException
6. ✅ 使用依赖注入获取服务
7. ✅ 使用 Pydantic Schema 进行数据验证
8. ✅ 使用类型提示
9. ✅ 在服务层记录日志
10. ✅ 使用绝对导入

## 详细规范

- **[服务层规范](./service.md)** - 服务层开发规范
- **[API 路由规范](./api.md)** - API 路由开发规范
- **[Repository Pattern 规范](./repository.md)** - Repository Pattern 开发规范 ⭐
- **[Unit of Work Pattern 规范](./unit_of_work.md)** - Unit of Work Pattern 开发规范 ⭐
- **[异常处理规范](./exception.md)** - 异常处理规范
- **[日志规范](./logging.md)** - 日志记录规范

## 工作流

- **[添加服务](./../workflows/add-service.md)** - 如何添加新服务
- **[添加 API](./../workflows/add-api.md)** - 如何添加新 API
- **[添加 Repository](./../workflows/add-repository.md)** - 如何添加新 Repository ⭐

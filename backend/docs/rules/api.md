# API 路由开发规范

## API 层职责

API 层（Router/Controller）负责处理 HTTP 请求和响应。

**职责：**
- ✅ 接收 HTTP 请求
- ✅ 参数验证（通过 Pydantic Schema）
- ✅ 调用服务层
- ✅ 格式化响应

**禁止：**
- ❌ 包含业务逻辑
- ❌ 直接访问数据库
- ❌ 直接抛出 HTTPException（使用自定义异常）

## 路由文件组织

```
app/api/v1/
├── router.py      # 路由注册
├── auth.py        # 认证相关路由
├── users.py       # 用户相关路由
└── [feature].py   # 其他功能路由
```

## 路由命名规范

- 文件名：`[feature].py`（如 `auth.py`, `users.py`）
- 路由前缀：`/[feature]`（如 `/auth`, `/users`）
- 路由函数：使用动词（如 `login`, `get_user`, `create_post`）

## 路由定义规范

### 1. 基本结构

```python
from fastapi import APIRouter, Depends
from app.core.dependencies import get_auth_service
from app.services.auth_service import AuthService
from app.schemas.user import UserLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["认证"])

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin = Body(...),
    auth_service: AuthService = Depends(get_auth_service),
):
    """用户登录"""
    return auth_service.login(login_data.username, login_data.password)
```

### 2. HTTP 方法

```python
# GET - 获取资源
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),
):
    return service.get_user_by_id(user_id)

# POST - 创建资源
@router.post("/users", response_model=UserResponse)
async def create_user(
    data: UserCreate,
    service: UserService = Depends(get_user_service),
):
    return service.create_user(data)

# PUT - 完整更新资源
@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    data: UserUpdate,
    service: UserService = Depends(get_user_service),
):
    return service.update_user(user_id, data)

# DELETE - 删除资源
@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    service: UserService = Depends(get_user_service),
):
    service.delete_user(user_id)
    return {"message": "删除成功"}
```

### 3. 路径参数

```python
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,  # 路径参数
    service: UserService = Depends(get_user_service),
):
    return service.get_user_by_id(user_id)
```

### 4. 查询参数

```python
from typing import Optional

@router.get("/users")
async def list_users(
    skip: int = 0,           # 查询参数
    limit: int = 10,         # 查询参数
    search: Optional[str] = None,  # 可选查询参数
    service: UserService = Depends(get_user_service),
):
    return service.list_users(skip=skip, limit=limit, search=search)
```

### 5. 请求体

```python
@router.post("/users")
async def create_user(
    data: UserCreate,  # 请求体（自动验证）
    service: UserService = Depends(get_user_service),
):
    return service.create_user(data)
```

### 6. 认证保护

```python
from app.core.dependencies import get_current_user
from app.models.user import User

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),  # 需要认证
    service: UserService = Depends(get_user_service),
):
    return service.get_current_user_info(current_user)
```

## 响应模型

使用 `response_model` 指定响应格式：

```python
@router.post("/users", response_model=UserResponse)
async def create_user(...):
    return service.create_user(...)  # 自动转换为 UserResponse
```

## 错误处理

**路由层不处理异常，由全局异常处理器处理：**

```python
# ✅ 正确：服务层抛出异常，全局处理器处理
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),
):
    return service.get_user_by_id(user_id)  # 如果不存在会抛出 NotFoundError

# ❌ 错误：在路由层处理异常
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),
):
    try:
        return service.get_user_by_id(user_id)
    except NotFoundError:
        raise HTTPException(status_code=404, detail="用户不存在")  # ❌
```

## 路由注册

在 `router.py` 中注册所有路由：

```python
from fastapi import APIRouter
from app.api.v1 import auth, users

api_router = APIRouter()

# 注册路由
api_router.include_router(auth.router)
api_router.include_router(users.router)
```

## 完整示例

### 用户路由示例

```python
from fastapi import APIRouter, Depends
from typing import Optional

from app.core.dependencies import get_current_user, get_user_service
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
)
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["用户"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
):
    """获取当前用户信息"""
    return service.get_current_user_info(current_user)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),
):
    """获取用户信息"""
    return service.get_user_by_id(user_id)


@router.post("", response_model=UserResponse)
async def create_user(
    data: UserCreate,
    service: UserService = Depends(get_user_service),
):
    """创建用户"""
    return service.create_user(data)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
):
    """更新用户（只能更新自己的信息）"""
    if current_user.id != user_id:
        raise AuthorizationError("只能更新自己的信息")
    return service.update_user(user_id, data)


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
):
    """删除用户（只能删除自己的账户）"""
    if current_user.id != user_id:
        raise AuthorizationError("只能删除自己的账户")
    service.delete_user(user_id)
    return {"message": "删除成功"}
```

## 最佳实践

1. **简洁性**：路由函数应该简洁，只调用服务层
2. **类型提示**：所有参数和返回值都要有类型提示
3. **文档字符串**：为每个路由添加详细的文档字符串（支持 OpenAPI/Swagger）
4. **响应模型**：使用 `response_model` 指定响应格式，确保类型安全
5. **HTTP 状态码**：使用 `status_code` 明确指定状态码（如 `status_code=200`）
6. **依赖注入**：使用 `Depends` 获取服务和当前用户
7. **异常处理**：让全局异常处理器处理异常
8. **统一响应格式**：所有响应使用统一格式，简单消息响应使用 `create_success_response(data=None, message="...")`

## 常见错误

### ❌ 错误示例

```python
# 错误1：业务逻辑在路由层
@router.post("/users")
async def create_user(data: UserCreate, db: Session = Depends(get_db)):
    user = User(...)  # ❌ 业务逻辑应该在服务层
    db.add(user)
    db.commit()

# 错误2：直接抛出 HTTPException
@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")  # ❌

# 错误3：没有使用服务层
@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()  # ❌

# 错误4：使用旧的依赖注入方式
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),  # ❌ 如果使用旧的 get_db
):
    return service.get_user_by_id(user_id)

# 错误4：使用旧的依赖注入方式
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),  # ❌ 如果使用旧的 get_db
):
    return service.get_user_by_id(user_id)
```

### ✅ 正确示例

```python
# 正确：只调用服务层（使用 Unit of Work）
@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),  # ✅ 使用 Unit of Work
):
    return service.get_user_by_id(user_id)  # ✅
```

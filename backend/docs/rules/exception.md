# 异常处理规范

## 异常处理原则

1. **使用自定义异常类**：不要直接抛出 `HTTPException`
2. **在服务层抛出异常**：路由层不处理异常
3. **全局异常处理器**：统一处理所有异常
4. **记录异常日志**：所有异常都要记录日志

## 自定义异常类

### 异常类定义

位置：`app/core/exceptions.py`

```python
from fastapi import HTTPException, status

class BaseAPIException(HTTPException):
    """基础 API 异常类"""
    pass

class AuthenticationError(BaseAPIException):
    """认证错误 - 401"""
    pass

class AuthorizationError(BaseAPIException):
    """授权错误 - 403"""
    pass

class NotFoundError(BaseAPIException):
    """资源未找到 - 404"""
    pass

class ValidationError(BaseAPIException):
    """验证错误 - 422"""
    pass

class ConflictError(BaseAPIException):
    """冲突错误 - 409"""
    pass
```

### 异常类列表

| 异常类 | HTTP 状态码 | 使用场景 |
|--------|------------|---------|
| `AuthenticationError` | 401 | 认证失败、Token 无效 |
| `AuthorizationError` | 403 | 权限不足、用户被禁用 |
| `NotFoundError` | 404 | 资源不存在 |
| `ValidationError` | 422 | 请求参数验证失败 |
| `ConflictError` | 409 | 资源冲突（如用户名已存在） |

## 使用异常

### 在服务层抛出异常

```python
from app.core.exceptions import NotFoundError, ConflictError

class UserService(BaseService):
    def get_user(self, user_id: str) -> User:
        """获取用户"""
        user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
        if not user:
            raise NotFoundError("用户不存在")
        return user
    
    def create_user(self, data: UserCreate) -> User:
        """创建用户"""
        # 检查用户名是否已存在
        if self.uow.users.is_username_exists(data.username):  # ✅ 通过 Repository
            raise ConflictError("用户名已存在")
        
        # 创建用户
        user = User(...)
        self.uow.users.create(user)  # ✅ 通过 Repository
        # 事务由 Unit of Work 自动管理
        return user
```

### 在路由层不处理异常

```python
# ✅ 正确：让全局异常处理器处理
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

## 全局异常处理器

位置：`app/core/exception_handlers.py`

全局异常处理器会自动：
- 捕获所有异常
- 记录异常日志
- 返回统一的错误响应格式

### 异常响应格式

```json
{
  "detail": "错误信息"
}
```

### 异常处理器示例

```python
async def base_api_exception_handler(
    request: Request, exc: BaseAPIException
) -> JSONResponse:
    """处理自定义 API 异常"""
    logger.warning(
        "API 异常",
        path=request.url.path,
        method=request.method,
        status_code=exc.status_code,
        detail=exc.detail,
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )
```

## 异常处理流程

```
请求
  ↓
路由层（不处理异常）
  ↓
服务层（抛出异常）
  ↓
全局异常处理器（捕获异常）
  ↓
记录日志 + 返回错误响应
```

## 常见场景

### 1. 资源不存在

```python
def get_user(self, user_id: str) -> User:
    user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
    if not user:
        raise NotFoundError("用户不存在")
    return user
```

### 2. 认证失败

```python
def authenticate_user(self, username: str, password: str) -> User:
    user = self.uow.users.get_by_username(username)  # ✅ 通过 Repository
    if not user or not verify_password(password, user.password_hash):
        raise AuthenticationError("用户名或密码错误")
    return user
```

### 3. 权限不足

```python
def delete_user(self, user_id: str, current_user: User):
    if current_user.id != user_id:
        raise AuthorizationError("只能删除自己的账户")
    # ...
```

### 4. 资源冲突

```python
def create_user(self, data: UserCreate) -> User:
    if self.uow.users.is_username_exists(data.username):  # ✅ 通过 Repository
        raise ConflictError("用户名已存在")
    # ...
```

### 5. 参数验证失败

```python
def update_user(self, user_id: str, data: UserUpdate) -> User:
    if data.name and len(data.name) < 1:
        raise ValidationError("用户名不能为空")
    # ...
```

## 最佳实践

1. **使用自定义异常**：不要直接抛出 `HTTPException`
2. **在服务层抛出**：路由层不处理异常
3. **异常信息清晰**：提供明确的错误信息
4. **记录日志**：所有异常都会自动记录日志
5. **统一格式**：所有异常返回统一的响应格式

## 常见错误

### ❌ 错误示例

```python
# 错误1：直接抛出 HTTPException
def get_user(self, user_id: str):
    user = self.uow.users.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")  # ❌

# 错误2：在路由层处理异常
@router.get("/users/{user_id}")
async def get_user(user_id: str, service: UserService = Depends(...)):
    try:
        return service.get_user_by_id(user_id)
    except NotFoundError:
        raise HTTPException(status_code=404, detail="用户不存在")  # ❌

# 错误3：服务层直接使用 ORM
def get_user(self, user_id: str):
    user = self.db.query(User).filter(User.id == user_id).first()  # ❌
    if not user:
        raise NotFoundError("用户不存在")
```

### ✅ 正确示例

```python
# 正确：使用自定义异常，通过 Repository 访问数据
def get_user(self, user_id: str) -> User:
    user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
    if not user:
        raise NotFoundError("用户不存在")  # ✅

# 正确：让全局处理器处理
@router.get("/users/{user_id}")
async def get_user(user_id: str, service: UserService = Depends(...)):
    return service.get_user_by_id(user_id)  # ✅ 异常会自动处理
```

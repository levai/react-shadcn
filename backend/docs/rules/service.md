# 服务层开发规范

## 服务层职责

服务层（Service Layer）负责处理业务逻辑，是架构的核心层。

**职责：**
- ✅ 业务逻辑处理
- ✅ 数据转换和验证
- ✅ 通过 Repository 访问数据 ⭐
- ✅ 异常处理
- ✅ 日志记录

**禁止：**
- ❌ 直接处理 HTTP 请求/响应
- ❌ 直接访问数据库（必须通过 Repository）⭐
- ❌ 直接使用 ORM（必须通过 Unit of Work）⭐
- ❌ 包含路由逻辑

## 服务基类

所有服务必须继承 `BaseService`：

```python
from app.services.base_service import BaseService
from app.core.unit_of_work import IUnitOfWork

class MyService(BaseService):
    """我的服务"""
    
    def __init__(self, uow: IUnitOfWork):
        super().__init__(uow)  # ✅ 使用 Unit of Work
        # 初始化代码
    
    def some_method(self) -> SomeResult:
        """方法说明"""
        self.logger.info("操作开始")
        # 通过 self.uow.repository 访问数据
        user = self.uow.users.get_by_id(user_id)  # ✅
        # 业务逻辑
        return result
```

## 服务命名规范

- 服务类名：`[Feature]Service`（如 `AuthService`, `UserService`）
- 文件名：`[feature]_service.py`（如 `auth_service.py`, `user_service.py`）
- 方法名：使用动词（如 `create_user`, `get_user`, `update_user`）

## 服务方法规范

### 1. 方法签名

```python
def method_name(self, param1: Type1, param2: Type2) -> ReturnType:
    """方法说明
    
    Args:
        param1: 参数1说明
        param2: 参数2说明
    
    Returns:
        返回值说明
    
    Raises:
        NotFoundError: 当资源不存在时
        ValidationError: 当参数验证失败时
    """
    pass
```

### 2. 异常处理

```python
from app.core.exceptions import NotFoundError, ValidationError

def get_user(self, user_id: str) -> User:
    """获取用户"""
    user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
    if not user:
        raise NotFoundError("用户不存在")
    return user
```

### 3. 日志记录

```python
def create_user(self, data: UserCreate) -> User:
    """创建用户"""
    self.logger.info("开始创建用户", username=data.username)
    
    try:
        # 业务逻辑
        user = User(...)
        self.uow.users.create(user)  # ✅ 通过 Repository
        # 事务由 Unit of Work 自动管理
        
        self.logger.info("用户创建成功", user_id=user.id)
        return user
    except Exception as e:
        self.logger.error("用户创建失败", error=str(e), exc_info=True)
        # 事务自动回滚（由 Unit of Work 管理）
        raise
```

### 4. 数据转换

```python
from app.schemas.user import UserCreate, UserResponse
from app.utils.password import get_password_hash

def create_user(self, data: UserCreate) -> UserResponse:
    """创建用户并返回响应"""
    # 转换为模型
    user = User(
        username=data.username,
        name=data.name,
        password_hash=get_password_hash(data.password)
    )
    
    # ✅ 通过 Repository 创建
    self.uow.users.create(user)
    # 事务由 Unit of Work 自动管理
    
    # 转换为响应
    return UserResponse.model_validate(user)
```

## 服务依赖注入

服务通过依赖注入获取 Unit of Work：

```python
# app/core/dependencies.py
def get_user_service(uow: IUnitOfWork = Depends(get_unit_of_work)) -> UserService:
    """获取用户服务"""
    return UserService(uow)  # ✅ 使用 Unit of Work

# 在路由中使用
@router.get("/users/{user_id}")
async def get_user(
    user_id: str,
    service: UserService = Depends(get_user_service),
):
    return service.get_user(user_id)
```

## 服务示例

### 完整示例

```python
from sqlalchemy.orm import Session
from app.services.base_service import BaseService
from app.core.exceptions import NotFoundError, ConflictError
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.utils.password import get_password_hash

class UserService(BaseService):
    """用户服务"""
    
    def get_user_by_id(self, user_id: str) -> User:
        """根据 ID 获取用户"""
        user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
        if not user:
            raise NotFoundError("用户不存在")
        return user
    
    def get_user_by_username(self, username: str) -> User:
        """根据用户名获取用户"""
        user = self.uow.users.get_by_username(username)  # ✅ 通过 Repository
        if not user:
            raise NotFoundError("用户不存在")
        return user
    
    def create_user(self, data: UserCreate) -> UserResponse:
        """创建用户"""
        # 检查用户名是否已存在
        if self.uow.users.is_username_exists(data.username):  # ✅ 通过 Repository
            raise ConflictError("用户名已存在")
        
        # 创建用户
        user = User(
            username=data.username,
            name=data.name,
            password_hash=get_password_hash(data.password),
        )
        
        # ✅ 通过 Repository 创建
        self.uow.users.create(user)
        # 事务由 Unit of Work 自动管理
        
        self.logger.info("用户创建成功", user_id=user.id, username=user.username)
        return UserResponse.model_validate(user)
    
    def update_user(self, user_id: str, data: UserUpdate) -> UserResponse:
        """更新用户"""
        user = self.get_user_by_id(user_id)
        
        if data.name is not None:
            user.name = data.name
        if data.avatar is not None:
            user.avatar = data.avatar
        
        # ✅ 通过 Repository 更新
        self.uow.users.update(user)
        # 事务由 Unit of Work 自动管理
        
        self.logger.info("用户更新成功", user_id=user.id)
        return UserResponse.model_validate(user)
```

## 最佳实践

1. **单一职责**：每个服务方法只做一件事
2. **异常处理**：使用自定义异常，不要捕获所有异常
3. **日志记录**：记录关键操作和错误
4. **事务管理**：确保数据库事务正确提交或回滚
5. **数据验证**：在服务层进行业务规则验证
6. **类型提示**：所有方法都要有类型提示

## 常见错误

### ❌ 错误示例

```python
# 错误1：业务逻辑在路由层
@router.post("/users")
async def create_user(data: UserCreate, db: Session = Depends(get_db)):
    user = User(...)  # ❌ 业务逻辑应该在服务层
    db.add(user)
    db.commit()

# 错误2：服务层直接使用 ORM
class UserService(BaseService):
    def get_user(self, user_id: str):
        user = self.db.query(User).filter(User.id == user_id).first()  # ❌
        if not user:
            raise NotFoundError("用户不存在")

# 错误3：直接抛出 HTTPException
def get_user(self, user_id: str):
    user = self.uow.users.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")  # ❌

# 错误4：没有日志记录
def create_user(self, data: UserCreate):
    user = User(...)  # ❌ 没有日志
    self.uow.users.create(user)
```

### ✅ 正确示例

```python
# 正确：业务逻辑在服务层，使用 Repository
class UserService(BaseService):
    def create_user(self, data: UserCreate) -> UserResponse:
        self.logger.info("开始创建用户", username=data.username)
        user = User(...)
        self.uow.users.create(user)  # ✅ 通过 Repository
        # 事务自动管理
        self.logger.info("用户创建成功", user_id=user.id)
        return UserResponse.model_validate(user)

# 正确：使用自定义异常
def get_user(self, user_id: str) -> User:
    user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Repository
    if not user:
        raise NotFoundError("用户不存在")  # ✅
    return user
```

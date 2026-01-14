# Repository Pattern 开发规范

## Repository Pattern 简介

Repository Pattern（仓储模式）是一种数据访问抽象模式，它将数据访问逻辑从业务逻辑中分离出来。

**目的：**
- 抽象数据访问逻辑
- 便于单元测试（可 Mock Repository）
- 便于切换数据源
- 降低耦合度

## 架构层次

```
Service Layer
    ↓
Repository Layer  ← 数据访问抽象层
    ↓
ORM Model
    ↓
Database
```

## Repository 基类

所有 Repository 继承自 `BaseRepository`：

```python
from app.repositories.base_repository import BaseRepository
from app.models.user import User
from sqlalchemy.orm import Session

class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(db, User)
```

## BaseRepository 提供的方法

### 基础 CRUD 操作

```python
# 根据 ID 获取
user = repository.get_by_id(user_id)

# 获取所有（分页）
users = repository.get_all(skip=0, limit=100)

# 创建
user = repository.create(user)

# 更新
user = repository.update(user)

# 删除
repository.delete(user)

# 计数
count = repository.count()

# 检查存在
exists = repository.exists(user_id)
```

## 自定义 Repository

### 示例：UserRepository

```python
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.base_repository import BaseRepository

class UserRepository(BaseRepository[User]):
    """用户 Repository"""
    
    def __init__(self, db: Session):
        super().__init__(db, User)
    
    def get_by_username(self, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return self.db.query(User).filter(User.username == username).first()
    
    def is_username_exists(self, username: str) -> bool:
        """检查用户名是否存在"""
        return self.db.query(User).filter(User.username == username).first() is not None
    
    def get_active_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        """获取活跃用户列表"""
        return (
            self.db.query(User)
            .filter(User.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
```

## 在服务层使用 Repository

### 通过 Unit of Work 访问

```python
from app.services.base_service import BaseService
from app.core.unit_of_work import IUnitOfWork

class UserService(BaseService):
    def get_user_by_id(self, user_id: str) -> User:
        """获取用户"""
        user = self.uow.users.get_by_id(user_id)  # ✅ 通过 Unit of Work 访问
        if not user:
            raise NotFoundError("用户不存在")
        return user
```

## Repository 命名规范

- Repository 类名：`[Entity]Repository`（如 `UserRepository`, `PostRepository`）
- 文件名：`[entity]_repository.py`（如 `user_repository.py`）
- 方法名：使用动词（如 `get_by_username`, `is_exists`）

## Repository 方法规范

### 1. 查询方法

```python
def get_by_username(self, username: str) -> Optional[User]:
    """根据用户名获取用户"""
    return self.db.query(User).filter(User.username == username).first()
```

**命名规范：**
- `get_by_[field]` - 根据字段获取单个实体
- `get_all` - 获取所有实体
- `find_by_[field]` - 查找（可能返回多个）

### 2. 检查方法

```python
def is_username_exists(self, username: str) -> bool:
    """检查用户名是否存在"""
    return self.db.query(User).filter(User.username == username).first() is not None
```

**命名规范：**
- `is_[field]_exists` - 检查字段是否存在
- `exists` - 检查实体是否存在

### 3. 创建/更新/删除

使用基类提供的方法：

```python
# 创建
user = User(...)
repository.create(user)

# 更新
user.name = "新名称"
repository.update(user)

# 删除
repository.delete(user)
```

## 最佳实践

1. **单一职责**：每个 Repository 只负责一个实体的数据访问
2. **返回类型明确**：使用 `Optional` 或具体类型
3. **异常处理**：Repository 不抛出业务异常，只返回数据
4. **查询优化**：使用索引、避免 N+1 查询
5. **类型提示**：所有方法都要有类型提示

## 常见错误

### ❌ 错误示例

```python
# 错误1：在 Repository 中处理业务逻辑
def get_user_by_id(self, user_id: str) -> User:
    user = self.db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("用户不存在")  # ❌ Repository 不应该抛出业务异常
    return user

# 错误2：在服务层直接使用 ORM
class UserService:
    def get_user(self, user_id: str):
        user = self.db.query(User).filter(User.id == user_id).first()  # ❌
```

### ✅ 正确示例

```python
# Repository：只返回数据
def get_by_id(self, user_id: str) -> Optional[User]:
    return self.db.query(User).filter(User.id == user_id).first()  # ✅

# Service：处理业务逻辑和异常
class UserService:
    def get_user(self, user_id: str) -> User:
        user = self.uow.users.get_by_id(user_id)  # ✅
        if not user:
            raise NotFoundError("用户不存在")  # ✅
        return user
```

## 测试 Repository

### Mock Repository 进行单元测试

```python
from unittest.mock import Mock
from app.services.user_service import UserService
from app.core.unit_of_work import IUnitOfWork

def test_get_user():
    # Mock Repository
    mock_repository = Mock()
    mock_repository.get_by_id.return_value = User(id="123", username="test")
    
    # Mock Unit of Work
    mock_uow = Mock()
    mock_uow.users = mock_repository
    
    # 测试服务
    service = UserService(mock_uow)
    user = service.get_user_by_id("123")
    
    assert user.username == "test"
    mock_repository.get_by_id.assert_called_once_with("123")
```

## 总结

Repository Pattern 提供了：
- ✅ 数据访问抽象
- ✅ 便于测试
- ✅ 降低耦合度
- ✅ 便于切换数据源

遵循 Repository Pattern 可以让代码更加清晰、可测试、可维护。

# Unit of Work Pattern 开发规范

## Unit of Work Pattern 简介

Unit of Work Pattern（工作单元模式）是一种事务管理模式，它协调多个 Repository 的操作，确保所有操作在同一个事务中执行。

**目的：**
- 统一事务管理
- 协调多个 Repository
- 确保数据一致性
- 简化跨服务操作

## 架构层次

```
Service Layer
    ↓
Unit of Work  ← 事务管理抽象层
    ↓
Repository Layer
    ↓
Database
```

## Unit of Work 实现

### 基本结构

```python
from app.core.unit_of_work import UnitOfWork, IUnitOfWork

class UnitOfWork:
    """Unit of Work 实现"""
    
    def __init__(self):
        self.session = SessionLocal()
        self.users = UserRepository(self.session)
        # 其他 Repository...
    
    def commit(self) -> None:
        """提交事务"""
        self.session.commit()
    
    def rollback(self) -> None:
        """回滚事务"""
        self.session.rollback()
```

## 在服务层使用 Unit of Work

### 通过依赖注入获取

```python
from app.services.base_service import BaseService
from app.core.unit_of_work import IUnitOfWork

class UserService(BaseService):
    def __init__(self, uow: IUnitOfWork):
        super().__init__(uow)
    
    def create_user(self, data: UserCreate) -> User:
        """创建用户"""
        # 使用 Unit of Work 的 Repository
        user = User(...)
        self.uow.users.create(user)
        # 事务会在请求结束时自动提交（通过依赖注入）
        return user
```

## FastAPI 依赖注入集成

### 依赖函数

```python
from app.core.unit_of_work import UnitOfWork

def get_unit_of_work():
    """获取 Unit of Work（用于依赖注入）"""
    uow = UnitOfWork()
    try:
        yield uow
        uow.commit()  # 请求成功时提交
    except Exception:
        uow.rollback()  # 请求失败时回滚
        raise
    finally:
        uow.close()  # 关闭会话
```

### 在路由中使用

```python
from fastapi import Depends
from app.core.unit_of_work import get_unit_of_work
from app.services.user_service import UserService

@router.post("/users")
async def create_user(
    data: UserCreate,
    uow: IUnitOfWork = Depends(get_unit_of_work),
):
    service = UserService(uow)
    return service.create_user(data)
```

## 事务管理

### 自动事务管理

通过 FastAPI 的依赖注入，事务会自动管理：

```python
# 请求成功 → 自动 commit
# 请求失败 → 自动 rollback
# 请求结束 → 自动 close
```

### 手动事务管理

如果需要手动控制事务：

```python
def complex_operation(self):
    """复杂操作"""
    try:
        # 操作1
        user = self.uow.users.create(user)
        
        # 操作2
        post = self.uow.posts.create(post)
        
        # 手动提交
        self.uow.commit()
    except Exception:
        # 手动回滚
        self.uow.rollback()
        raise
```

## 跨 Repository 操作

### 示例：创建用户和初始数据

```python
class UserService(BaseService):
    def create_user_with_profile(self, data: UserCreate) -> User:
        """创建用户及其配置文件"""
        # 操作1：创建用户
        user = User(...)
        self.uow.users.create(user)
        
        # 操作2：创建配置文件
        profile = UserProfile(user_id=user.id, ...)
        self.uow.profiles.create(profile)
        
        # 所有操作在同一个事务中
        # 如果任何一个失败，都会回滚
        return user
```

## Unit of Work 的优势

### 1. 数据一致性

```python
# 所有操作在同一个事务中
# 要么全部成功，要么全部失败
def transfer_money(self, from_user_id: str, to_user_id: str, amount: float):
    from_user = self.uow.users.get_by_id(from_user_id)
    to_user = self.uow.users.get_by_id(to_user_id)
    
    from_user.balance -= amount
    to_user.balance += amount
    
    self.uow.users.update(from_user)
    self.uow.users.update(to_user)
    # 如果任何一步失败，整个事务回滚
```

### 2. 简化测试

```python
# Mock Unit of Work
mock_uow = Mock()
mock_uow.users = MockUserRepository()
mock_uow.posts = MockPostRepository()

service = UserService(mock_uow)
# 测试服务逻辑，不需要真实数据库
```

### 3. 清晰的边界

```python
# 每个请求一个 Unit of Work
# 请求开始 → 创建 Unit of Work
# 请求结束 → 提交/回滚并关闭
```

## 最佳实践

1. **一个请求一个 Unit of Work**：每个 HTTP 请求创建一个 Unit of Work
2. **自动事务管理**：通过依赖注入自动管理事务生命周期
3. **异常处理**：异常时自动回滚
4. **资源清理**：请求结束时自动关闭会话

## 常见错误

### ❌ 错误示例

```python
# 错误1：多个 Unit of Work
def create_user(self):
    uow1 = UnitOfWork()
    uow2 = UnitOfWork()  # ❌ 应该使用同一个 Unit of Work
    uow1.users.create(user)
    uow2.commit()

# 错误2：忘记提交
def create_user(self):
    user = User(...)
    self.uow.users.create(user)
    # ❌ 忘记 commit，数据不会保存
```

### ✅ 正确示例

```python
# 正确：通过依赖注入自动管理
@router.post("/users")
async def create_user(
    data: UserCreate,
    uow: IUnitOfWork = Depends(get_unit_of_work),  # ✅
):
    service = UserService(uow)
    return service.create_user(data)  # ✅ 自动提交
```

## 总结

Unit of Work Pattern 提供了：
- ✅ 统一事务管理
- ✅ 数据一致性保证
- ✅ 简化跨 Repository 操作
- ✅ 便于测试

遵循 Unit of Work Pattern 可以让事务管理更加清晰、可靠。

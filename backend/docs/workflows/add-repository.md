# 添加新 Repository

## 步骤

### 1. 确保 Model 已存在

Repository 需要对应的 Model，确保 Model 已经创建。

### 2. 创建 Repository 文件

在 `app/repositories/` 目录下创建 Repository 文件：

```bash
touch app/repositories/post_repository.py
```

### 3. 实现 Repository

```python
# app/repositories/post_repository.py
from typing import Optional
from sqlalchemy.orm import Session

from app.models.post import Post
from app.repositories.base_repository import BaseRepository


class PostRepository(BaseRepository[Post]):
    """文章 Repository"""
    
    def __init__(self, db: Session):
        super().__init__(db, Post)
    
    def get_by_title(self, title: str) -> Optional[Post]:
        """根据标题获取文章"""
        return self.db.query(Post).filter(Post.title == title).first()
    
    def get_by_author_id(self, author_id: str, skip: int = 0, limit: int = 100) -> list[Post]:
        """根据作者 ID 获取文章列表"""
        return (
            self.db.query(Post)
            .filter(Post.author_id == author_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search_by_keyword(self, keyword: str, skip: int = 0, limit: int = 100) -> list[Post]:
        """根据关键词搜索文章"""
        return (
            self.db.query(Post)
            .filter(Post.title.contains(keyword) | Post.content.contains(keyword))
            .offset(skip)
            .limit(limit)
            .all()
        )
```

### 4. 注册 Repository

在 `app/repositories/__init__.py` 中导出：

```python
from app.repositories.post_repository import PostRepository

__all__ = ["BaseRepository", "UserRepository", "PostRepository"]
```

### 5. 在 Unit of Work 中添加

在 `app/core/unit_of_work.py` 中添加：

```python
from app.repositories.post_repository import PostRepository

class UnitOfWork:
    def __init__(self, session: Session | None = None):
        self.session: Session = session or SessionLocal()
        self._users: UserRepository | None = None
        self._posts: PostRepository | None = None  # 新增
    
    @property
    def posts(self) -> PostRepository:
        """获取文章 Repository"""
        if self._posts is None:
            self._posts = PostRepository(self.session)
        return self._posts
```

### 6. 在服务层使用

```python
# app/services/post_service.py
class PostService(BaseService):
    def get_post_by_id(self, post_id: str) -> Post:
        """获取文章"""
        post = self.uow.posts.get_by_id(post_id)  # ✅ 使用 Repository
        if not post:
            raise NotFoundError("文章不存在")
        return post
```

## Repository 方法设计原则

### 1. 基础 CRUD

使用基类提供的方法：
- `get_by_id(id)` - 根据 ID 获取
- `get_all(skip, limit)` - 获取所有（分页）
- `create(obj)` - 创建
- `update(obj)` - 更新
- `delete(obj)` - 删除
- `count()` - 计数
- `exists(id)` - 检查存在

### 2. 自定义查询方法

根据业务需求添加：

```python
# 根据字段查询
def get_by_username(self, username: str) -> Optional[User]:
    """根据用户名获取用户"""
    return self.db.query(User).filter(User.username == username).first()

# 复杂查询
def get_active_users(self, skip: int = 0, limit: int = 100) -> list[User]:
    """获取活跃用户列表"""
    return (
        self.db.query(User)
        .filter(User.is_active == True)
        .offset(skip)
        .limit(limit)
        .all()
    )

# 检查方法
def is_username_exists(self, username: str) -> bool:
    """检查用户名是否存在"""
    return self.db.query(User).filter(User.username == username).first() is not None
```

## 检查清单

- [ ] Model 已创建
- [ ] Repository 文件已创建
- [ ] 继承自 `BaseRepository[Model]`
- [ ] 实现自定义查询方法
- [ ] 注册到 `__init__.py`
- [ ] 在 Unit of Work 中添加
- [ ] 在服务层使用

## 示例代码

完整示例请参考：
- `app/repositories/user_repository.py` - 用户 Repository 示例
- `app/repositories/base_repository.py` - Repository 基类

## 最佳实践

1. **单一职责**：每个 Repository 只负责一个实体的数据访问
2. **返回类型明确**：使用 `Optional` 或具体类型
3. **不处理业务逻辑**：Repository 只返回数据，不抛出业务异常
4. **查询优化**：使用索引、避免 N+1 查询
5. **类型提示**：所有方法都要有类型提示

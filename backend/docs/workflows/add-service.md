# 添加新服务

## 步骤

### 1. 创建服务文件

在 `app/services/` 目录下创建服务文件：

```bash
touch app/services/post_service.py
```

### 2. 定义 Schema

在 `app/schemas/` 目录下创建 Schema：

```python
# app/schemas/post.py
from pydantic import BaseModel, Field
from datetime import datetime

class PostBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    content: str | None = Field(None, min_length=1)

class PostResponse(PostBase):
    id: str
    author_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

### 3. 定义模型

在 `app/models/` 目录下创建模型：

```python
# app/models/post.py
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from app.core.database import Base
import uuid

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
```

### 4. 创建 Repository（必须先创建）

参考：[添加 Repository](./add-repository.md)

### 5. 创建服务

```python
# app/services/post_service.py
from app.services.base_service import BaseService
from app.core.exceptions import NotFoundError, AuthorizationError
from app.core.unit_of_work import IUnitOfWork
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate, PostResponse

class PostService(BaseService):
    """文章服务"""
    
    def get_post_by_id(self, post_id: str) -> Post:
        """根据 ID 获取文章"""
        post = self.uow.posts.get_by_id(post_id)  # ✅ 通过 Repository
        if not post:
            raise NotFoundError("文章不存在")
        return post
    
    def create_post(self, data: PostCreate, author_id: str) -> PostResponse:
        """创建文章"""
        self.logger.info("开始创建文章", title=data.title, author_id=author_id)
        
        post = Post(
            title=data.title,
            content=data.content,
            author_id=author_id,
        )
        
        # ✅ 通过 Repository 创建
        self.uow.posts.create(post)
        # 事务由 Unit of Work 自动管理
        
        self.logger.info("文章创建成功", post_id=post.id)
        return PostResponse.model_validate(post)
    
    def update_post(self, post_id: str, data: PostUpdate, user_id: str) -> PostResponse:
        """更新文章"""
        post = self.get_post_by_id(post_id)
        
        # 检查权限
        if post.author_id != user_id:
            raise AuthorizationError("只能修改自己的文章")
        
        if data.title is not None:
            post.title = data.title
        if data.content is not None:
            post.content = data.content
        
        # ✅ 通过 Repository 更新
        self.uow.posts.update(post)
        # 事务由 Unit of Work 自动管理
        
        self.logger.info("文章更新成功", post_id=post.id)
        return PostResponse.model_validate(post)
    
    def delete_post(self, post_id: str, user_id: str) -> None:
        """删除文章"""
        post = self.get_post_by_id(post_id)
        
        # 检查权限
        if post.author_id != user_id:
            raise AuthorizationError("只能删除自己的文章")
        
        # ✅ 通过 Repository 删除
        self.uow.posts.delete(post)
        # 事务由 Unit of Work 自动管理
        
        self.logger.info("文章删除成功", post_id=post_id)
```

### 6. 注册服务

在 `app/services/__init__.py` 中导出：

```python
from app.services.post_service import PostService

__all__ = ["AuthService", "UserService", "PostService"]
```

### 7. 添加依赖注入

在 `app/core/dependencies.py` 中添加：

```python
from app.core.unit_of_work import IUnitOfWork, get_unit_of_work
from app.services.post_service import PostService

def get_post_service(uow: IUnitOfWork = Depends(get_unit_of_work)) -> PostService:
    """获取文章服务"""
    return PostService(uow)  # ✅ 使用 Unit of Work
```

### 8. 创建路由（可选）

如果需要 API，创建路由文件：

```python
# app/api/v1/posts.py
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, get_post_service
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["文章"])

@router.post("", response_model=PostResponse)
async def create_post(
    data: PostCreate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """创建文章"""
    return service.create_post(data, current_user.id)

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    service: PostService = Depends(get_post_service),
):
    """获取文章"""
    return service.get_post_by_id(post_id)

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    data: PostUpdate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """更新文章"""
    return service.update_post(post_id, data, current_user.id)

@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    """删除文章"""
    service.delete_post(post_id, current_user.id)
    return {"message": "删除成功"}
```

### 9. 注册路由

在 `app/api/v1/router.py` 中注册：

```python
from app.api.v1 import auth, users, posts

api_router.include_router(posts.router)
```

## 检查清单

- [ ] 创建 Schema 文件
- [ ] 创建 Model 文件
- [ ] **创建 Repository 文件**（必须先创建）⭐
- [ ] **在 Unit of Work 中注册 Repository** ⭐
- [ ] 创建 Service 文件（继承 BaseService）
- [ ] 实现业务逻辑方法（使用 `self.uow.repository`）
- [ ] 添加异常处理
- [ ] 添加日志记录
- [ ] 注册服务到 `__init__.py`
- [ ] 添加依赖注入函数（使用 Unit of Work）
- [ ] （可选）创建路由文件
- [ ] （可选）注册路由

## 示例代码

完整示例请参考：
- `app/services/auth_service.py` - 认证服务示例（使用 Repository）
- `app/services/user_service.py` - 用户服务示例（使用 Repository）
- `app/repositories/user_repository.py` - Repository 实现示例

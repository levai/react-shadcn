# 添加新 API

## 步骤

### 1. 确保服务层已存在

API 路由必须调用服务层，确保对应的服务已经创建。

参考：[添加新服务](./add-service.md)

### 2. 创建路由文件

在 `app/api/v1/` 目录下创建路由文件：

```bash
touch app/api/v1/posts.py
```

### 3. 定义路由

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
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """创建文章"""
    return service.create_post(data, current_user.id)

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """获取文章"""
    return service.get_post_by_id(post_id)

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    data: PostUpdate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """更新文章"""
    return service.update_post(post_id, data, current_user.id)

@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """删除文章"""
    service.delete_post(post_id, current_user.id)
    return {"message": "删除成功"}
```

### 4. 注册路由

在 `app/api/v1/router.py` 中注册：

```python
from fastapi import APIRouter
from app.api.v1 import auth, users, posts

api_router = APIRouter()

# 注册路由
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(posts.router)  # 新增
```

### 5. 测试 API

启动服务后，访问 Swagger 文档测试：

```
http://localhost:8000/docs
```

## RESTful API 设计规范

### 资源命名

- 使用复数名词：`/posts`, `/users`, `/comments`
- 使用小写字母和连字符：`/user-profiles`
- 避免动词：`/get-posts` ❌ → `/posts` ✅

### HTTP 方法

| 方法 | 用途 | 示例 |
|------|------|------|
| GET | 获取资源 | `GET /posts/{id}` |
| POST | 创建资源 | `POST /posts` |
| PUT | 完整更新资源 | `PUT /posts/{id}` |
| PATCH | 部分更新资源 | `PATCH /posts/{id}` |
| DELETE | 删除资源 | `DELETE /posts/{id}` |

### 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|---------|
| 200 | OK | 成功获取/更新资源 |
| 201 | Created | 成功创建资源 |
| 204 | No Content | 成功删除资源 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突 |
| 422 | Unprocessable Entity | 验证失败 |
| 500 | Internal Server Error | 服务器错误 |

### 响应格式

**成功响应：**

```json
{
  "id": "123",
  "title": "文章标题",
  "content": "文章内容"
}
```

**错误响应：**

```json
{
  "detail": "错误信息"
}
```

## 完整示例

### CRUD API 示例

```python
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.core.dependencies import get_current_user, get_post_service
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["文章"])

# 创建
@router.post("", response_model=PostResponse, status_code=201)
async def create_post(
    data: PostCreate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """创建文章"""
    return service.create_post(data, current_user.id)

# 列表查询
@router.get("", response_model=list[PostResponse])
async def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """获取文章列表"""
    return service.list_posts(skip=skip, limit=limit, search=search)

# 详情查询
@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """获取文章详情"""
    return service.get_post_by_id(post_id)

# 更新
@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    data: PostUpdate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """更新文章"""
    return service.update_post(post_id, data, current_user.id)

# 删除
@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    """删除文章"""
    service.delete_post(post_id, current_user.id)
```

## 检查清单

- [ ] 服务层已创建
- [ ] Schema 已定义
- [ ] 路由文件已创建
- [ ] 路由已注册到 `router.py`
- [ ] 使用依赖注入获取服务
- [ ] 使用 `response_model` 指定响应格式
- [ ] 添加文档字符串
- [ ] 测试 API 功能

## 常见错误

### ❌ 错误示例

```python
# 错误1：业务逻辑在路由层
@router.post("/posts")
async def create_post(data: PostCreate, db: Session = Depends(get_db)):
    post = Post(...)  # ❌
    db.add(post)
    db.commit()

# 错误2：直接抛出 HTTPException
@router.get("/posts/{post_id}")
async def get_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")  # ❌

# 错误3：服务层直接使用 ORM
class PostService:
    def get_post(self, post_id: str):
        post = self.db.query(Post).filter(...).first()  # ❌
```

### ✅ 正确示例

```python
# 正确：只调用服务层（使用 Unit of Work）
@router.get("/posts/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    service: PostService = Depends(get_post_service),  # ✅ 使用 Unit of Work
):
    return service.get_post_by_id(post_id)  # ✅
```

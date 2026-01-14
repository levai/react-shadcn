# FastAPI Backend

FastAPI 后端服务

## 快速开始

### 1. 创建虚拟环境

```bash
# 如果使用 pyenv，先设置 Python 版本
pyenv local 3.13.5  # 或 3.12.7

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

**注意**：如果遇到 `pip: command not found` 错误，请确保已激活虚拟环境。

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置相关参数
```

**CORS 配置（开发环境）：**

开发环境默认使用通配符 `*`，允许所有源访问（方便测试）：

```bash
# .env 文件
CORS_ORIGINS=*
```

**注意**：使用通配符时，`allow_credentials` 会自动禁用，但 JWT Token 通过 `Authorization` header 传递，不受影响。

**生产环境**：必须明确指定允许的域名：

```bash
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. 初始化数据库

```bash
# macOS/Linux
PYTHONPATH=$(pwd) python app/db_init.py

# 或者使用模块方式
python -m app.db_init
```

**注意**：确保已激活虚拟环境，并且设置了正确的 PYTHONPATH。

这将创建数据库表并创建一个默认管理员用户：
- 用户名: `admin`
- 密码: `admin123`

### 6. 运行服务

**确保已激活虚拟环境！**

**方式一：使用启动脚本（推荐）**
```bash
python run.py
```

**方式二：使用 uvicorn 命令**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**方式三：使用模块方式**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. 访问文档

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # 应用入口
│   ├── db_init.py           # 数据库初始化脚本
│   ├── api/                 # API 路由层（Controller）
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py
│   │       ├── auth.py      # 认证路由
│   │       └── users.py     # 用户路由
│   ├── services/            # 业务逻辑层（Service）
│   │   ├── __init__.py
│   │   ├── base_service.py  # 服务基类
│   │   ├── auth_service.py  # 认证服务
│   │   └── user_service.py  # 用户服务
│   ├── repositories/        # 数据访问层（Repository）⭐
│   │   ├── __init__.py
│   │   ├── base_repository.py  # Repository 基类
│   │   └── user_repository.py  # 用户 Repository
│   ├── models/              # 数据模型层（SQLAlchemy ORM）
│   │   ├── __init__.py
│   │   └── user.py          # 用户模型
│   ├── schemas/             # 数据验证层（Pydantic）
│   │   ├── __init__.py
│   │   └── user.py          # 用户模式
│   ├── core/                # 核心配置
│   │   ├── __init__.py
│   │   ├── config.py        # 配置管理
│   │   ├── database.py      # 数据库连接
│   │   ├── security.py      # 安全相关（JWT）
│   │   ├── exceptions.py    # 自定义异常类
│   │   ├── exception_handlers.py  # 全局异常处理器
│   │   ├── logging.py       # 日志配置
│   │   ├── dependencies.py  # 依赖注入
│   │   └── unit_of_work.py  # Unit of Work Pattern ⭐
│   ├── middleware/          # 中间件
│   │   ├── __init__.py
│   │   └── logging.py       # 请求日志中间件
│   └── utils/               # 工具函数
│       ├── __init__.py
│       └── password.py       # 密码加密
├── requirements.txt
├── .env.example
├── run.py
└── README.md
```

## 项目架构

### 架构模式

本项目采用**企业级分层架构**模式，实现了 **Repository Pattern** 和 **Unit of Work Pattern**，符合业界最佳实践。

### 架构层次

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

### 各层职责

#### 1. API 层（`app/api/`）
- **职责**：处理 HTTP 请求、参数验证、响应格式化
- **禁止**：包含业务逻辑、直接访问数据库
- **示例**：
```python
@router.post("/users", response_model=UserResponse)
async def create_user(
    data: UserCreate,
    service: UserService = Depends(get_user_service),
):
    return service.create_user(data)  # ✅ 只调用服务层
```

#### 2. Service 层（`app/services/`）
- **职责**：业务逻辑处理、数据转换、异常处理、日志记录
- **禁止**：直接使用 ORM、处理 HTTP 请求/响应
- **示例**：
```python
class UserService(BaseService):
    def create_user(self, data: UserCreate) -> UserResponse:
        # ✅ 通过 Repository 访问数据
        if self.uow.users.is_username_exists(data.username):
            raise ConflictError("用户名已存在")
        
        user = User(...)
        self.uow.users.create(user)  # ✅ 事务自动管理
        return UserResponse.model_validate(user)
```

#### 3. Unit of Work 层（`app/core/unit_of_work.py`）
- **职责**：统一事务管理、协调多个 Repository
- **特点**：自动提交/回滚、FastAPI 依赖注入集成
- **示例**：
```python
class UnitOfWork:
    def __init__(self):
        self.session = SessionLocal()
        self.users = UserRepository(self.session)
    
    def commit(self):
        self.session.commit()
    
    def rollback(self):
        self.session.rollback()
```

#### 4. Repository 层（`app/repositories/`）
- **职责**：数据访问抽象、封装 ORM 操作
- **特点**：便于测试（可 Mock）、便于切换数据源
- **示例**：
```python
class UserRepository(BaseRepository[User]):
    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def is_username_exists(self, username: str) -> bool:
        return self.db.query(User).filter(User.username == username).first() is not None
```

#### 5. Model 层（`app/models/`）
- **职责**：数据库模型定义（SQLAlchemy ORM）
- **特点**：数据库表结构映射

#### 6. Schema 层（`app/schemas/`）
- **职责**：请求/响应数据验证（Pydantic）
- **特点**：自动类型转换、数据验证

### 核心特性

- ✅ **Repository Pattern**：数据访问抽象，便于测试和切换数据源 ⭐
- ✅ **Unit of Work Pattern**：统一事务管理，自动提交/回滚 ⭐
- ✅ **服务层分离**：业务逻辑独立于路由层
- ✅ **统一异常处理**：自定义异常类和全局处理器
- ✅ **结构化日志**：使用 structlog 记录请求和错误
- ✅ **依赖注入**：使用 FastAPI 的 Depends 管理依赖
- ✅ **类型安全**：完整的类型提示

### 架构优势

1. **可测试性提升**：可以通过 Mock Repository 进行单元测试，无需真实数据库
2. **事务管理统一**：所有事务由 Unit of Work 统一管理，自动提交/回滚
3. **数据访问抽象**：服务层与数据库实现解耦，便于切换数据源
4. **代码可维护性**：分层清晰，职责明确，便于维护和扩展
5. **数据库无关性**：支持 SQLite、PostgreSQL、MySQL 等多种数据库，架构保持一致 ⭐

### 生产环境说明

**✅ 生产环境架构完全一致**

- 架构模式：企业级分层架构（Repository Pattern + Unit of Work Pattern）
- 代码结构：与开发环境完全相同
- 数据库支持：PostgreSQL（推荐）或 MySQL/MariaDB
- 配置方式：通过环境变量（`.env`）切换数据库

**生产环境与开发环境的区别：**

| 项目 | 开发环境 | 生产环境 |
|------|---------|---------|
| 数据库 | SQLite | PostgreSQL / MySQL |
| 调试模式 | `DEBUG=True` | `DEBUG=False` |
| 日志级别 | INFO | WARNING/ERROR |
| 连接池 | 默认 | 启用预检查 |
| CORS | 开发域名 | 生产域名 |

## API 端点

### 认证相关

- `POST /api/v1/auth/login` - 用户登录
  - **请求**：`{"username": "admin", "password": "admin123"}`
  - **响应**（业界标准格式）：
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 1800,
      "refresh_token": null
    }
    ```
- `POST /api/v1/auth/logout` - 用户登出（需要认证）
- `GET /api/v1/auth/me` - 获取当前用户信息（需要认证）

### 用户相关

- `GET /api/v1/users/me` - 获取当前用户信息（需要认证，兼容前端 API）

## 数据库

### 数据库支持

本项目使用 SQLAlchemy ORM，支持多种数据库：

- ✅ **SQLite**（开发环境默认）
- ✅ **PostgreSQL**（生产环境推荐）
- ✅ **MySQL/MariaDB**（生产环境可选）

### 切换数据库

在 `.env` 文件中修改 `DATABASE_URL`：

```bash
# SQLite（开发环境默认）
DATABASE_URL=sqlite:///./app.db

# PostgreSQL（生产环境推荐）
DATABASE_URL=postgresql://user:password@localhost/dbname
# 或使用 psycopg2
DATABASE_URL=postgresql+psycopg2://user:password@localhost/dbname

# MySQL/MariaDB（生产环境可选）
DATABASE_URL=mysql+pymysql://user:password@localhost/dbname
# 或使用 mysqlclient
DATABASE_URL=mysql+mysqldb://user:password@localhost/dbname
```

### 安装数据库驱动

**PostgreSQL：**
```bash
pip install psycopg2-binary
```

**MySQL/MariaDB：**
```bash
# 方式一：使用 pymysql（纯 Python，推荐）
pip install pymysql

# 方式二：使用 mysqlclient（需要系统依赖）
pip install mysqlclient
```

### 生产环境建议

- **推荐使用 PostgreSQL**：功能强大，性能优秀，支持复杂查询
- **MySQL 也可以使用**：如果团队熟悉 MySQL，完全可以使用
- **架构保持不变**：无论使用哪种数据库，Repository Pattern 和 Unit of Work Pattern 都完全适用

## 开发规范

> 📖 **详细规范**: 完整规范请查看 [`docs/rules/ai-instructions.md`](./docs/rules/ai-instructions.md)

### 核心规则

1. ✅ 遵循分层架构（Router → Service → Unit of Work → Repository → Model）
2. ✅ 业务逻辑在服务层，路由层只处理 HTTP
3. ✅ 使用 Repository Pattern，禁止服务层直接使用 ORM ⭐
4. ✅ 使用 Unit of Work Pattern 管理事务 ⭐
5. ✅ 使用自定义异常类，禁止直接抛出 HTTPException
6. ✅ 统一响应格式（业界标准）：`{"code": HTTP状态码, "message": "...", "data": ...}` ⭐
7. ✅ 使用依赖注入获取服务
8. ✅ 使用 Pydantic Schema 进行数据验证
9. ✅ 使用类型提示
10. ✅ 在服务层记录日志
11. ✅ 使用绝对导入

### 快速参考

**编写新功能：**
1. 定义 Schema（`app/schemas/`）
2. 定义 Model（`app/models/`）
3. **创建 Repository（`app/repositories/`）** - 数据访问抽象 ⭐
4. **在 Unit of Work 中注册 Repository** ⭐
5. 创建 Service（`app/services/`）- 实现业务逻辑（使用 Repository）
6. 创建 Router（`app/api/v1/`）- 处理 HTTP 请求
7. 注册路由（`app/api/v1/router.py`）

**详细工作流：**
- [添加新 Repository](./docs/workflows/add-repository.md) ⭐
- [添加新服务](./docs/workflows/add-service.md)
- [添加新 API](./docs/workflows/add-api.md)

### 文档

> 📖 **完整文档索引**：查看 [文档索引](./docs/README.md) 获取所有文档的详细导航

**快速链接：**
- [架构总览](./docs/ARCHITECTURE_OVERVIEW.md) - 快速了解项目架构 ⭐
- [AI 编程助手统一规范](./docs/rules/ai-instructions.md) - 主规范文件（**唯一维护源**）
- [生产环境部署指南](./docs/PRODUCTION.md) - 生产环境配置 ⭐


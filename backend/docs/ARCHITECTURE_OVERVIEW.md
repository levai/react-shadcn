# 后端工程架构总览

> 📖 **本文档提供后端项目的完整架构梳理和关键信息总结**

## 📋 目录

- [项目结构](#项目结构)
- [技术栈](#技术栈)
- [架构模式](#架构模式)
- [API 端点](#api-端点)
- [数据模型](#数据模型)
- [错误处理](#错误处理)
- [认证授权](#认证授权)
- [数据库支持](#数据库支持)
- [开发规范](#开发规范)

## 📁 项目结构

```
backend/
├── app/
│   ├── main.py                    # FastAPI 应用入口
│   ├── db_init.py                 # 数据库初始化脚本
│   ├── api/                       # API 路由层（Controller）
│   │   └── v1/
│   │       ├── router.py          # 路由注册
│   │       ├── auth.py            # 认证路由
│   │       └── users.py           # 用户路由
│   ├── services/                  # 业务逻辑层（Service）
│   │   ├── base_service.py        # 服务基类
│   │   ├── auth_service.py        # 认证服务
│   │   └── user_service.py        # 用户服务
│   ├── repositories/              # 数据访问层（Repository）⭐
│   │   ├── base_repository.py     # Repository 基类
│   │   └── user_repository.py     # 用户 Repository
│   ├── models/                     # 数据模型层（SQLAlchemy ORM）
│   │   └── user.py                # 用户模型
│   ├── schemas/                    # 数据验证层（Pydantic）
│   │   ├── user.py                # 用户 Schema
│   │   └── error.py               # 错误响应 Schema
│   ├── core/                       # 核心配置
│   │   ├── config.py              # 配置管理
│   │   ├── database.py            # 数据库连接
│   │   ├── security.py            # JWT 安全
│   │   ├── exceptions.py          # 自定义异常类
│   │   ├── exception_handlers.py  # 全局异常处理器
│   │   ├── logging.py             # 日志配置
│   │   ├── dependencies.py        # 依赖注入
│   │   └── unit_of_work.py        # Unit of Work Pattern ⭐
│   ├── middleware/                 # 中间件
│   │   └── logging.py             # 请求日志中间件
│   └── utils/                      # 工具函数
│       └── password.py            # 密码加密
├── docs/                           # 文档目录
│   ├── README.md                  # 文档索引
│   ├── PRODUCTION.md              # 生产环境部署指南
│   ├── rules/                     # 开发规范
│   └── workflows/                 # 工作流文档
├── requirements.txt               # Python 依赖
├── run.py                         # 启动脚本
└── README.md                      # 项目说明
```

## 🛠 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **FastAPI** | 0.128+ | Web 框架 |
| **SQLAlchemy** | 2.0.45+ | ORM |
| **Pydantic** | 2.12+ | 数据验证 |
| **Python** | 3.12+ | 编程语言 |
| **structlog** | 25.5+ | 结构化日志 |
| **python-jose** | 3.5+ | JWT 认证 |
| **Alembic** | 1.15+ | 数据库迁移 |
| **Uvicorn** | 0.40+ | ASGI 服务器 |

## 🏗 架构模式

### 分层架构

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

### 设计模式

1. **Repository Pattern** ⭐
   - 数据访问抽象
   - 便于测试（可 Mock）
   - 便于切换数据源

2. **Unit of Work Pattern** ⭐
   - 统一事务管理
   - 自动提交/回滚
   - FastAPI 依赖注入集成

3. **依赖注入**
   - FastAPI `Depends` 管理依赖
   - 服务通过 Unit of Work 获取 Repository

## 🔌 API 端点

### 认证相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `POST` | `/api/v1/auth/login` | 用户登录 | ❌ |
| `POST` | `/api/v1/auth/logout` | 用户登出 | ✅ |
| `GET` | `/api/v1/auth/me` | 获取当前用户信息 | ✅ |

### 用户相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/api/v1/users/me` | 获取当前用户信息（兼容前端） | ✅ |

### 系统相关

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| `GET` | `/` | 根路径 | ❌ |
| `GET` | `/health` | 健康检查 | ❌ |
| `GET` | `/docs` | Swagger UI | ❌ |
| `GET` | `/redoc` | ReDoc | ❌ |

## 📊 数据模型

### User（用户）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String(36) | UUID，主键 |
| `username` | String(50) | 用户名，唯一索引 |
| `password_hash` | String(255) | 密码哈希 |
| `name` | String(100) | 显示名称 |
| `avatar` | String(500) | 头像 URL（可选） |
| `is_active` | Boolean | 是否激活 |
| `created_at` | DateTime | 创建时间 |
| `updated_at` | DateTime | 更新时间 |

## ⚠️ 错误处理

### 统一响应格式（成功和错误一致）

所有 API 响应都使用统一格式：

```json
{
  "code": 响应代码（HTTP 状态码，200 表示成功，其他表示错误）,
  "message": "响应消息（可选）",
  "data": "响应数据（成功时为数据，错误时为 null）"
}
```

**成功响应：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {...}
}
```

**错误响应：**
```json
{
  "code": 422,
  "message": "验证失败",
  "data": null
}
```

### 响应代码说明

`code` 字段使用 **HTTP 状态码**：

| HTTP 状态码 | code 值 | 说明 |
|------------|---------|------|
| 200 | 200 | 成功 |
| 201 | 201 | 创建成功 |
| 400 | 400 | 请求错误 |
| 401 | 401 | 认证失败 |
| 403 | 403 | 权限不足 |
| 404 | 404 | 资源未找到 |
| 409 | 409 | 资源冲突 |
| 422 | 422 | 请求参数验证失败 |
| 500 | 500 | 服务器内部错误 |

### 异常类

- `BaseAPIException` - 基础异常类
- `AuthenticationError` - 认证错误（401）
- `AuthorizationError` - 授权错误（403）
- `NotFoundError` - 资源未找到（404）
- `ValidationError` - 验证错误（422）
- `ConflictError` - 冲突错误（409）

## 🔐 认证授权

### JWT Token 格式（业界标准）

**登录响应：**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 1800,
  "refresh_token": null
}
```

**请求头：**
```
Authorization: Bearer <access_token>
```

### 默认用户

- **用户名**: `admin`
- **密码**: `admin123`

## 🗄 数据库支持

### 支持的数据库

- ✅ **SQLite**（开发环境默认）
- ✅ **PostgreSQL**（生产环境推荐）
- ✅ **MySQL/MariaDB**（生产环境可选）

### 数据库配置

在 `.env` 文件中配置 `DATABASE_URL`：

```bash
# SQLite（开发环境）
DATABASE_URL=sqlite:///./app.db

# PostgreSQL（生产环境推荐）
DATABASE_URL=postgresql://user:password@localhost/dbname

# MySQL/MariaDB（生产环境可选）
DATABASE_URL=mysql+pymysql://user:password@localhost/dbname
```

### 数据库特性

- ✅ 连接池预检查（`pool_pre_ping=True`）
- ✅ 连接回收（`pool_recycle=3600`）
- ✅ 自动事务管理（Unit of Work）
- ✅ 多数据库兼容（架构保持一致）

## 📝 开发规范

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

### 开发工作流

**添加新功能：**
1. 定义 Schema（`app/schemas/`）
2. 定义 Model（`app/models/`）
3. **创建 Repository（`app/repositories/`）** ⭐
4. **在 Unit of Work 中注册 Repository** ⭐
5. 创建 Service（`app/services/`）- 实现业务逻辑（使用 Repository）
6. 创建 Router（`app/api/v1/`）- 处理 HTTP 请求
7. 注册路由（`app/api/v1/router.py`）

### 文档索引

- **[AI 编程助手统一规范](./rules/ai-instructions.md)** - 主规范文件（**唯一维护源**）
- [服务层规范](./rules/service.md) - 服务层开发规范
- [API 路由规范](./rules/api.md) - API 路由开发规范
- [Repository Pattern 规范](./rules/repository.md) - Repository Pattern 开发规范 ⭐
- [Unit of Work Pattern 规范](./rules/unit_of_work.md) - Unit of Work Pattern 开发规范 ⭐
- [异常处理规范](./rules/exception.md) - 异常处理规范
- [日志规范](./rules/logging.md) - 日志记录规范

## 🎯 架构优势

1. **可测试性提升**：可以通过 Mock Repository 进行单元测试，无需真实数据库
2. **事务管理统一**：所有事务由 Unit of Work 统一管理，自动提交/回滚
3. **数据访问抽象**：服务层与数据库实现解耦，便于切换数据源
4. **代码可维护性**：分层清晰，职责明确，便于维护和扩展
5. **数据库无关性**：支持 SQLite、PostgreSQL、MySQL 等多种数据库，架构保持一致 ⭐

## 📚 相关文档

- [项目 README](../README.md)
- [文档索引](./README.md)
- [生产环境部署指南](./PRODUCTION.md)
- [前端文档](../../frontend/docs/rules/ai-instructions.md)

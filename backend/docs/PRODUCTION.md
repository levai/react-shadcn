# 生产环境部署指南

## 生产环境架构

**✅ 生产环境架构与开发环境完全一致**

本项目采用**企业级分层架构**模式，无论开发环境还是生产环境，都使用相同的架构：

- ✅ Repository Pattern（数据访问抽象）
- ✅ Unit of Work Pattern（事务管理）
- ✅ 服务层分离
- ✅ 统一异常处理
- ✅ 结构化日志

## 数据库选择

### 支持的数据库

| 数据库 | 推荐场景 | 驱动包 |
|--------|---------|--------|
| **PostgreSQL** | 生产环境推荐 ⭐ | `psycopg2-binary` |
| **MySQL/MariaDB** | 生产环境可选 | `pymysql` 或 `mysqlclient` |
| **SQLite** | 仅开发环境 | 内置 |

### 配置数据库

在 `.env` 文件中设置 `DATABASE_URL`：

```bash
# PostgreSQL（推荐）
DATABASE_URL=postgresql+psycopg2://user:password@localhost/dbname

# MySQL/MariaDB
DATABASE_URL=mysql+pymysql://user:password@localhost/dbname

# SQLite（仅开发环境）
DATABASE_URL=sqlite:///./app.db
```

### 安装数据库驱动

**PostgreSQL：**
```bash
pip install psycopg2-binary
```

**MySQL/MariaDB：**
```bash
# 方式一：pymysql（纯 Python，推荐）
pip install pymysql

# 方式二：mysqlclient（需要系统依赖）
pip install mysqlclient
```

## 生产环境配置

### 环境变量配置

创建 `.env` 文件（生产环境）：

```bash
# 应用配置
DEBUG=False
APP_NAME=FastAPI Backend
APP_VERSION=1.0.0

# 服务器配置
HOST=0.0.0.0
PORT=3000

# 数据库配置（PostgreSQL 或 MySQL）
DATABASE_URL=postgresql+psycopg2://user:password@localhost/dbname
# 或
DATABASE_URL=mysql+pymysql://user:password@localhost/dbname

# JWT 配置（必须修改）
SECRET_KEY=your-production-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS 配置（生产域名）
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 日志配置
LOG_LEVEL=WARNING
```

### 数据库连接优化

生产环境已自动启用以下优化：

- ✅ **连接池预检查**：`pool_pre_ping=True` - 自动检测并重连断开的连接
- ✅ **连接回收**：`pool_recycle=3600` - 每小时回收连接，避免长时间连接超时
- ✅ **MySQL 字符集**：自动设置为 `utf8mb4`，支持完整的 Unicode

## 部署检查清单

### 代码层面

- [x] 架构模式：Repository Pattern + Unit of Work Pattern
- [x] 数据库无关：使用 SQLAlchemy ORM，支持多种数据库
- [x] 连接池优化：自动启用预检查和连接回收
- [x] 异常处理：统一的异常处理机制
- [x] 日志系统：结构化日志，支持 JSON 格式

### 配置层面

- [ ] 修改 `SECRET_KEY`（必须）
- [ ] 配置生产数据库（PostgreSQL 或 MySQL）
- [ ] 设置正确的 `CORS_ORIGINS`
- [ ] 设置 `DEBUG=False`
- [ ] 配置日志级别为 `WARNING` 或 `ERROR`

### 数据库层面

- [ ] 创建生产数据库
- [ ] 运行数据库迁移（Alembic）
- [ ] 创建必要的索引
- [ ] 配置数据库备份策略

### 安全层面

- [ ] 使用 HTTPS
- [ ] 配置防火墙规则
- [ ] 设置数据库访问权限
- [ ] 定期更新依赖包

## 生产环境 vs 开发环境

| 项目 | 开发环境 | 生产环境 |
|------|---------|---------|
| **架构模式** | 企业级分层架构 | ✅ 完全相同 |
| **Repository Pattern** | ✅ | ✅ |
| **Unit of Work Pattern** | ✅ | ✅ |
| **数据库** | SQLite | PostgreSQL / MySQL |
| **调试模式** | `DEBUG=True` | `DEBUG=False` |
| **日志级别** | INFO | WARNING/ERROR |
| **连接池** | 默认 | 启用预检查 |
| **CORS** | 开发域名 | 生产域名 |

## 常见问题

### Q: 生产环境可以使用 MySQL 吗？

**A: 完全可以！** 本项目使用 SQLAlchemy ORM，完全支持 MySQL/MariaDB。只需：

1. 安装 MySQL 驱动：`pip install pymysql`
2. 配置 `DATABASE_URL=mysql+pymysql://user:password@localhost/dbname`
3. 架构和代码完全不需要修改

### Q: 从 SQLite 迁移到 PostgreSQL/MySQL 需要改代码吗？

**A: 不需要！** 由于使用了 Repository Pattern，数据访问层已完全抽象，只需修改 `DATABASE_URL` 即可。

### Q: 生产环境的性能如何？

**A: 优秀！** 企业级架构模式带来的优势：

- Repository Pattern：便于优化查询和缓存
- Unit of Work Pattern：统一事务管理，减少数据库连接
- 连接池优化：自动管理连接，提高性能

## 总结

✅ **生产环境架构与开发环境完全一致**  
✅ **支持 PostgreSQL 和 MySQL**  
✅ **无需修改代码，只需配置环境变量**  
✅ **企业级架构模式，生产环境就绪**

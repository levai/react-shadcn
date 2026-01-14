# 快速启动指南

## 前后端集成启动

### 1. 启动后端服务

#### macOS/Linux

```bash
cd backend

# 激活虚拟环境
source venv/bin/activate

# 如果还没初始化数据库
PYTHONPATH=$(pwd) python app/db_init.py
# 或使用模块方式
python -m app.db_init

# 启动服务
python run.py
```

#### Windows

```powershell
# 进入后端目录
cd backend

# 激活虚拟环境
venv\Scripts\activate

# 如果还没初始化数据库
python -m app.db_init

# 启动服务
python run.py
```

**注意**：Windows 上如果遇到 `python: command not found`，请使用 `py` 命令替代：
```powershell
py -m app.db_init
py run.py
```

后端服务将在 `http://localhost:8000` 启动。

**验证后端**：访问 http://localhost:8000/docs 查看 API 文档

### 2. 启动前端服务

前端启动方式在 macOS/Linux 和 Windows 上相同：

```bash
cd frontend

# 安装依赖（如果还没安装）
pnpm install

# 启动开发服务器
pnpm dev
```

**注意**：如果 Windows 上没有安装 `pnpm`，可以使用 `npm` 或 `yarn`：
```powershell
# 使用 npm
npm install
npm run dev

# 或使用 yarn
yarn install
yarn dev
```

前端服务将在 `http://localhost:5178` 启动。

### 3. 测试登录流程

1. **访问前端**：http://localhost:5178
2. **自动跳转到登录页**：http://localhost:5178/login
3. **输入默认账号**：
   - 用户名：`admin`
   - 密码：`admin123`
4. **点击登录**：登录成功后自动跳转到首页
5. **查看用户信息**：首页右上角显示当前登录用户

## 配置说明

### 前端配置

- **开发环境**：使用 Vite 代理（已配置）
  - 前端请求 `/api/*` 自动代理到 `http://localhost:8000/api/*`
  - 无需额外配置

- **生产环境**：需要配置环境变量
  ```bash
  VITE_API_BASE_URL=https://your-api-domain.com/api
  ```

### 后端配置

- **CORS**：开发环境默认使用通配符 `*`（允许所有源），方便本地测试
- **端口**：默认 `8000`，可在 `.env` 中修改
- **数据库**：默认 SQLite（开发环境）

**CORS 配置说明：**
- 开发环境：`CORS_ORIGINS=*`（默认，允许所有源）
- 生产环境：必须在 `.env` 中明确指定域名，如 `CORS_ORIGINS=https://yourdomain.com`

## 默认账号

- **用户名**：`admin`
- **密码**：`admin123`

## API 端点

### 认证相关

- `POST /api/v1/auth/login` - 用户登录
  - **响应格式**（JWT 标准格式）：
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 1800,
      "refresh_token": null
    }
    ```

- `POST /api/v1/auth/logout` - 用户登出（需要认证）
  - **响应格式**（统一响应格式）：
    ```json
    {
      "code": 200,
      "message": "登出成功",
      "data": null
    }
    ```

- `GET /api/v1/auth/me` - 获取当前用户信息（需要认证）
  - **响应格式**：直接返回用户对象（UserResponse）

### 用户相关

- `GET /api/v1/users/me` - 获取当前用户信息（需要认证，兼容前端 API 路径）
  - **响应格式**：直接返回用户对象（UserResponse）

### 统一响应格式说明

> 📖 **详细说明**：查看 [后端文档](./backend/README.md) 或 [架构总览](./backend/docs/ARCHITECTURE_OVERVIEW.md)

所有 API 响应（除登录接口外）都使用统一格式：

```json
{
  "code": HTTP状态码（200表示成功，其他表示错误）,
  "message": "响应消息（可选）",
  "data": "响应数据（成功时为数据，错误时为 null）"
}
```

**成功响应示例：**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {...}
}
```

**错误响应示例：**
```json
{
  "code": 401,
  "message": "认证失败",
  "data": null
}
```

## 常见问题

### 1. CORS 错误

**问题**：浏览器控制台显示 CORS 错误

**解决**：
- 确保后端服务正在运行
- 开发环境默认使用通配符 `*`，应该不会有 CORS 问题
- 如果仍有问题，检查 `.env` 文件中的 `CORS_ORIGINS` 配置

### 2. 401 未授权

**问题**：登录后访问需要认证的接口返回 401

**解决**：
- 检查 Token 是否正确存储（查看浏览器 localStorage）
- 检查请求头是否包含 `Authorization: Bearer <token>`
- 检查 Token 是否过期（默认 30 分钟）

### 3. 网络错误

**问题**：无法连接到后端服务

**解决**：
- 确认后端服务正在运行（访问 http://localhost:8000/docs）
- 检查后端端口是否正确（默认 8000）
- 检查前端代理配置（`vite.config.ts`）

### 4. 登录失败

**问题**：输入账号密码后提示登录失败

**解决**：
- 确认使用正确的账号：`admin` / `admin123`
- 检查后端数据库是否已初始化
- 查看后端日志确认错误信息

### 5. Windows 特定问题

**问题**：Windows 上无法激活虚拟环境

**解决**：
- 确保使用 PowerShell 或 CMD（不是 Git Bash）
- 如果遇到执行策略错误，运行：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- 使用完整路径：`.\venv\Scripts\activate`

**问题**：Windows 上 `python` 命令不可用

**解决**：
- 使用 `py` 命令替代：`py -m app.db_init`、`py run.py`
- 或使用完整路径：`C:\Python3x\python.exe`

## 开发建议

1. **同时启动**：前后端需要同时运行才能正常使用
2. **查看日志**：后端日志会显示所有请求和错误信息
3. **使用 Swagger**：访问 http://localhost:8000/docs 测试 API
4. **检查网络**：使用浏览器开发者工具查看网络请求

## 下一步

- 查看 [后端文档](./backend/README.md) 了解后端架构和快速开始
- 查看 [文档索引](./backend/docs/README.md) 获取完整文档导航
- 查看 [架构总览](./backend/docs/ARCHITECTURE_OVERVIEW.md) 快速了解项目架构 ⭐
- 查看 [生产环境部署指南](./backend/docs/PRODUCTION.md) 了解生产环境配置

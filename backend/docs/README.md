# 后端文档索引

> 📖 本文档提供后端项目的所有文档索引和快速导航

## 📚 文档结构

```
docs/
├── README.md                    # 本文档（文档索引）
├── ARCHITECTURE_OVERVIEW.md    # 架构总览（快速了解项目）⭐
├── PRODUCTION.md               # 生产环境部署指南
├── rules/                      # 开发规范
│   ├── ai-instructions.md      # AI 编程助手统一规范（主规范）
│   ├── service.md              # 服务层规范
│   ├── api.md                  # API 路由规范
│   ├── repository.md           # Repository Pattern 规范 ⭐
│   ├── unit_of_work.md          # Unit of Work Pattern 规范 ⭐
│   ├── exception.md            # 异常处理规范
│   └── logging.md              # 日志规范
└── workflows/                   # 工作流文档
    ├── add-service.md          # 添加新服务
    ├── add-api.md              # 添加新 API
    └── add-repository.md       # 添加新 Repository ⭐
```

## 🎯 快速开始

### 新开发者必读

1. **[架构总览](./ARCHITECTURE_OVERVIEW.md)** - 快速了解项目架构、API 端点、数据模型等 ⭐
2. **[AI 编程助手统一规范](./rules/ai-instructions.md)** - 开始前必读，了解项目架构和核心规则

### 开发新功能

1. **[添加新 Repository](./workflows/add-repository.md)** - 如何创建新的 Repository ⭐
2. **[添加新服务](./workflows/add-service.md)** - 如何创建新的服务层
3. **[添加新 API](./workflows/add-api.md)** - 如何创建新的 API 路由

### 开发规范

- **[服务层规范](./rules/service.md)** - 服务层开发规范
- **[API 路由规范](./rules/api.md)** - API 路由开发规范
- **[Repository Pattern 规范](./rules/repository.md)** - Repository Pattern 开发规范 ⭐
- **[Unit of Work Pattern 规范](./rules/unit_of_work.md)** - Unit of Work Pattern 开发规范 ⭐
- **[异常处理规范](./rules/exception.md)** - 异常处理规范
- **[日志规范](./rules/logging.md)** - 日志记录规范

## 📖 文档说明

### 规范文档（rules/）

#### ai-instructions.md
**AI 编程助手统一规范** - 这是所有 AI 工具的统一规范源文件

- 项目架构说明
- 技术栈介绍
- 核心规则总结
- 所有规范文档的索引

#### service.md
**服务层开发规范**

- 服务层职责
- 服务基类使用
- 服务命名规范
- 服务方法规范
- 完整示例

#### api.md
**API 路由开发规范**

- API 层职责
- 路由文件组织
- 路由定义规范
- RESTful API 设计
- 完整示例

#### exception.md
**异常处理规范**

- 异常处理原则
- 自定义异常类
- 异常使用示例
- 全局异常处理器

#### logging.md
**日志记录规范**

- 日志系统介绍
- 日志级别说明
- 日志使用示例
- 最佳实践

### 工作流文档（workflows/）

#### add-repository.md ⭐
**添加新 Repository 工作流**

- 创建 Repository 文件的步骤
- Repository 方法设计原则
- 在 Unit of Work 中注册
- 检查清单

#### add-service.md
**添加新服务工作流**

- 创建服务文件的步骤
- Schema 定义
- Model 定义
- **Repository 创建**（必须先创建）⭐
- Service 实现（使用 Repository）
- 依赖注入配置（使用 Unit of Work）
- 检查清单

#### add-api.md
**添加新 API 工作流**

- 创建路由文件的步骤
- RESTful API 设计规范
- 路由注册
- 测试方法
- 检查清单

## 🔍 如何使用文档

### 对于 AI 助手

AI 助手应该：
1. 首先阅读 `rules/ai-instructions.md` 了解项目规范
2. 根据任务类型参考相应的规范文档
3. 遵循工作流文档中的步骤

### 对于开发者

开发者应该：
1. 阅读 `rules/ai-instructions.md` 了解项目架构
2. 开发新功能时参考 `workflows/` 中的工作流
3. 遇到问题时查看相应的规范文档

## 📝 文档维护

- **主规范文件**：`rules/ai-instructions.md` 是唯一维护源
- **其他文档**：参考主规范文件，保持一致性
- **更新原则**：更新规范时，优先更新主规范文件

## 🔗 相关链接

- [项目 README](../README.md)
- [前端文档](../../frontend/docs/rules/ai-instructions.md)

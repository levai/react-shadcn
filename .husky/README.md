# Husky Git Hooks

本项目使用 Husky 管理 Git hooks，确保代码质量。

## 安装

Hooks 文件已配置完成，无需额外操作。

**注意：** 
- Husky v9 已废弃 `husky install` 命令
- Husky v9 已废弃 `husky add` 命令，hook 文件需要手动创建
- 本项目已按照官方标准格式创建了所有必要的 hook 文件
- 如果需要在新的环境中设置 hooks，可以手动运行 `npx husky`（需要确保在 git 仓库根目录）

## Hooks 说明

### pre-commit

在提交代码前自动运行 `lint-staged`，检查并修复暂存的文件：

- 自动修复 ESLint 问题
- 只检查暂存的文件（提高性能）

### commit-msg

使用 **commitlint**（官方标准工具）检查 commit message 格式。

**配置文件：** `commitlint.config.cjs`

**格式要求：**
```
<type>: <subject>
```

**type 类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建相关
- `ci`: CI 配置
- `chore`: 其他变更
- `revert`: 回滚

**示例：**
```
feat: 添加用户登录功能
fix: 修复侧边栏折叠问题
docs: 更新开发规范文档
```

**优势：**
- ✅ 使用官方标准工具（commitlint）
- ✅ 支持更多规则和配置选项
- ✅ 更好的错误提示信息
- ✅ 符合 Conventional Commits 规范

## 跳过 Hooks（不推荐）

如果确实需要跳过 hooks（紧急情况），可以使用：

```bash
git commit --no-verify -m "feat: 紧急修复"
```

**注意：** 只有在紧急情况下才使用，正常情况下应该修复问题后再提交。

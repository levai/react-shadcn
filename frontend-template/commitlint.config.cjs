/**
 * Commitlint 配置
 * 官方标准配置，使用 Conventional Commits 规范
 * 
 * 文档: https://commitlint.js.org/
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 类型
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 bug
        'docs',     // 文档变更
        'style',    // 代码格式（不影响功能）
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 测试相关
        'build',    // 构建相关
        'ci',       // CI 配置
        'chore',    // 其他变更
        'revert',   // 回滚
      ],
    ],
    // subject 不能为空
    'subject-empty': [2, 'never'],
    // subject 最大长度
    'subject-max-length': [2, 'always', 50],
    // type 不能为空
    'type-empty': [2, 'never'],
    // type 大小写
    'type-case': [2, 'always', 'lower-case'],
  },
}

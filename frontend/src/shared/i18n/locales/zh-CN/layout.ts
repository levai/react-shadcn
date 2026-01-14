/**
 * 布局相关翻译 - 简体中文
 *
 * 使用嵌套结构，按功能分组，更易维护
 */
export default {
  // 导航菜单
  nav: {
    home: '首页',
    dashboard: '仪表盘',
    overview: '概览',
    settings: '设置',
    profile: '个人资料',
  },

  // 主题设置
  theme: {
    label: '主题',
    light: '浅色主题',
    dark: '深色主题',
    system: '跟随系统',
  },

  // 语言设置
  language: {
    label: '语言',
  },

  // 侧边栏
  sidebar: {
    label: '侧边栏',
    collapse: '收起',
    expand: '展开',
    menu: '菜单',
    collapseMenu: '收起菜单',
    expandMenu: '展开菜单',
    expandMenuShortcut: '展开菜单 (Ctrl+B)',
  },
} as const

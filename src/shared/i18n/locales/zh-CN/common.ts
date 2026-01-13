/**
 * 通用翻译 - 简体中文
 * 
 * 使用嵌套结构，按功能分组，更易维护
 */
export default {
  // 操作按钮
  actions: {
    confirm: '确认',
    cancel: '取消',
    submit: '提交',
    reset: '重置',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    export: '导出',
    import: '导入',
    refresh: '刷新',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    finish: '完成',
    close: '关闭',
    open: '打开',
  },
  
  // 状态
  status: {
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
    noData: '暂无数据',
  },
  
  // 消息提示
  messages: {
    operationSuccess: '操作成功',
    operationFailed: '操作失败',
    confirmDelete: '确认删除吗？',
  },
  
  // 时间相关
  time: {
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
  },
  
  // 表单验证
  validation: {
    required: '此项为必填项',
    invalidEmail: '请输入有效的邮箱地址',
    invalidPhone: '请输入有效的手机号码',
  },
  
  // 分页
  pagination: {
    total: '共 {{total}} 条',
    page: '第 {{current}} / {{total}} 页',
  },
} as const

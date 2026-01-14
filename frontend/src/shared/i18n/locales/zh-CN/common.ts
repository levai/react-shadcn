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
    create: '创建',
    update: '更新',
    createUser: '创建用户',
    editUser: '编辑用户',
    activate: '激活',
    deactivate: '停用',
    activateSuccess: '激活成功',
    deactivateSuccess: '停用成功',
    createSuccess: '创建成功',
    updateSuccess: '更新成功',
    deleteSuccess: '删除成功',
    operationFailed: '操作失败',
    confirmDelete: '确认删除 {{name}} 吗？',
    label: '操作',
  },

  // 状态
  status: {
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
    noData: '暂无数据',
    active: '已激活',
  },

  // 通用字段
  username: '用户名',
  password: '密码',
  name: '姓名',
  avatar: '头像',
  avatarOptional: '头像（可选）',
  avatarPlaceholder: 'https://example.com/avatar.jpg',
  total: '总计',
  loading: '加载中...',
  errorOccurred: '发生错误',
  inactive: '已停用',
  userManagement: '用户管理',
  optional: '可选',
  statusLabel: '状态',
  createdAt: '创建时间',

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

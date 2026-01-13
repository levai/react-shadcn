/**
 * 认证相关翻译 - 简体中文
 *
 * 使用嵌套结构，按功能分组，更易维护
 */
export default {
  // 操作按钮
  login: '登录',
  logout: '退出登录',
  register: '注册',

  // 表单字段
  form: {
    username: '用户名',
    password: '密码',
    email: '邮箱',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
  },

  // 登录相关
  loginPage: {
    title: '欢迎回来',
    subtitle: '请输入您的账号信息',
  },

  // 消息提示
  messages: {
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    logoutSuccess: '已退出登录',
    invalidCredentials: '用户名或密码错误',
    tokenExpired: '登录已过期，请重新登录',
    unauthorized: '未授权，请先登录',
  },
} as const

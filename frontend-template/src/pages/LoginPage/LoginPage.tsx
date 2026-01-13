import { LoginForm } from '@/features/auth'

/**
 * 登录页面
 */
const LoginPage = () => {
  return (
    <div className='w-full p-8 space-y-6 bg-card rounded-lg shadow-lg border'>
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold'>欢迎登录</h1>
        <p className='text-muted-foreground'>请输入您的账号信息</p>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage

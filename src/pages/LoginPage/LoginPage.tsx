import { LoginForm } from '@/features/auth'
import { useTranslation } from '@/shared/i18n'

/**
 * 登录页面
 */
const LoginPage = () => {
  const { t } = useTranslation('auth')
  return (
    <div className='w-full p-8 space-y-6 bg-card rounded-lg shadow-lg border'>
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold'>{t('loginPage.title')}</h1>
        <p className='text-muted-foreground'>{t('loginPage.subtitle')}</p>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage

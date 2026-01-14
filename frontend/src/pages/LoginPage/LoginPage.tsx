import { LoginForm } from '@/features/auth'
import { useTranslation } from '@/shared/i18n'
import { Card, Typography, Space } from 'antd'

const { Title, Paragraph } = Typography

/**
 * 登录页面
 */
const LoginPage = () => {
  const { t } = useTranslation('auth')
  return (
    <Card className="w-full shadow-lg">
      <Space direction="vertical" size="large" className="w-full">
        <div className="text-center">
          <Title level={2}>{t('loginPage.title')}</Title>
          <Paragraph className="text-muted-foreground mb-0">{t('loginPage.subtitle')}</Paragraph>
        </div>
        <LoginForm />
      </Space>
    </Card>
  )
}

export default LoginPage

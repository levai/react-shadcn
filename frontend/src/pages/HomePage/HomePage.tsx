import { useTranslation } from '@/shared/i18n'
import { Card, Row, Col, Typography } from 'antd'

const { Title, Paragraph } = Typography

/**
 * 首页
 */
const HomePage = () => {
  const { t } = useTranslation('home')

  const features = [
    {
      icon: '🏗️',
      titleKey: t('homePage.features.fsdArchitecture.title'),
      descriptionKey: t('homePage.features.fsdArchitecture.description'),
    },
    {
      icon: '🤖',
      titleKey: t('homePage.features.aiFriendly.title'),
      descriptionKey: t('homePage.features.aiFriendly.description'),
    },
    {
      icon: '⚡',
      titleKey: t('homePage.features.modernStack.title'),
      descriptionKey: t('homePage.features.modernStack.description'),
    },
    {
      icon: '🔐',
      titleKey: t('homePage.features.authSystem.title'),
      descriptionKey: t('homePage.features.authSystem.description'),
    },
    {
      icon: '📦',
      titleKey: t('homePage.features.codeSplitting.title'),
      descriptionKey: t('homePage.features.codeSplitting.description'),
    },
    {
      icon: '📝',
      titleKey: t('homePage.features.documentation.title'),
      descriptionKey: t('homePage.features.documentation.description'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <Title level={2} className="mb-2">
          {t('homePage.welcome.title')}
        </Title>
        <Paragraph className="text-muted-foreground mb-0">
          {t('homePage.welcome.description')}
        </Paragraph>
      </Card>

      {/* Feature Cards */}
      <Row gutter={[16, 16]}>
        {features.map(feature => (
          <Col xs={24} sm={12} lg={8} key={feature.titleKey}>
            <Card hoverable>
              <div className="text-3xl mb-3">{feature.icon}</div>
              <Title level={4} className="mb-2">
                {feature.titleKey}
              </Title>
              <Paragraph className="text-sm text-muted-foreground mb-0">
                {feature.descriptionKey}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomePage

import { useTranslation } from '@/shared/i18n'

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
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {/* Welcome Card */}
      <div className='col-span-full p-6 bg-card rounded-lg border'>
        <h2 className='text-2xl font-bold mb-2'>{t('homePage.welcome.title')}</h2>
        <p className='text-muted-foreground'>{t('homePage.welcome.description')}</p>
      </div>

      {/* Feature Cards */}
      {features.map(feature => (
        <div key={feature.titleKey} className='p-6 bg-card rounded-lg border hover:shadow-md transition-shadow'>
          <div className='text-3xl mb-3'>{feature.icon}</div>
          <h3 className='font-semibold mb-2'>{feature.titleKey}</h3>
          <p className='text-sm text-muted-foreground'>{feature.descriptionKey}</p>
        </div>
      ))}
    </div>
  )
}

export default HomePage

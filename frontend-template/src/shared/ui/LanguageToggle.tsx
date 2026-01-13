import { useTranslation } from '@/shared/i18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'
import { Languages } from 'lucide-react'
import { useLocalStorageState } from '@/shared/hooks'
import { useEffect } from 'react'
import i18n from '@/shared/i18n'

/**
 * 语言切换组件
 * 
 * 支持的语言：
 * - zh-CN: 简体中文
 * - en-US: 英语
 */
export function LanguageToggle() {
  const { t } = useTranslation('layout')
  const [language, setLanguage] = useLocalStorageState<string>('i18nextLng', {
    defaultValue: 'zh-CN',
  })

  // 同步语言设置到 i18n
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  const languages = [
    { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
  ]

  const currentLang = languages.find(lang => lang.code === language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='relative h-9 w-9'>
          <Languages className='h-5 w-5' />
          <span className='sr-only'>{t('language.label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className='mr-2'>{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.code && (
              <span className='ml-auto text-xs'>✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

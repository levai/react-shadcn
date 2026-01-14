import { useTranslation } from '@/shared/i18n'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Button } from './button'
import { Languages } from 'lucide-react'
import { useI18nStore, SUPPORTED_LANGUAGES } from '@/shared/stores'

/**
 * 语言切换组件
 */
export function LanguageToggle() {
  const { t } = useTranslation('layout')
  const { language, changeLanguage } = useI18nStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('language.label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            <span>{lang.label}</span>
            {language === lang.code && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

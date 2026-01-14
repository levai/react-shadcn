import { useTranslation } from '@/shared/i18n'
import { Button, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Languages } from 'lucide-react'
import { useI18nStore, SUPPORTED_LANGUAGES } from '@/shared/stores'

/**
 * 语言切换组件
 */
export function LanguageToggle() {
  const { language, changeLanguage } = useI18nStore()

  const menuItems: MenuProps['items'] = SUPPORTED_LANGUAGES.map(lang => ({
    key: lang.code,
    label: (
      <span className="flex items-center">
        <span className="mr-2 flex h-4 w-4 items-center justify-center">{lang.flag}</span>
        <span>{lang.label}</span>
        {language === lang.code && <span className="ml-auto text-xs">✓</span>}
      </span>
    ),
    onClick: () => changeLanguage(lang.code),
  }))

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button
        size="small"
        shape="circle"
        icon={<Languages className="h-4 w-4" />}
        className="relative p-0"
      ></Button>
    </Dropdown>
  )
}

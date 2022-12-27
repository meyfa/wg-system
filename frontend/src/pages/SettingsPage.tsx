import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import SettingsBox from '../components/settings/SettingsBox'
import BasicDropdown from '../components/forms/BasicDropdown'
import SettingsItem from '../components/settings/SettingsItem'
import SettingsInfo from '../components/settings/SettingsInfo'
import Rule from '../components/settings/Rule'

function useLanguageFormatter (): (lang: string) => string {
  const { t } = useTranslation()

  return useCallback(lang => t('language', { lng: lang }), [t])
}

export default function SettingsPage (): ReactElement {
  const { t, i18n } = useTranslation()

  const languages = i18n.options.resources != null
    ? Object.keys(i18n.options.resources)
    : []

  const changeLanguage = useCallback((value: string) => {
    void i18n.changeLanguage(value)
  }, [i18n])

  const formatLanguage = useLanguageFormatter()

  return (
    <NavigationBarLayout centered>
      <Title title={t('settings.title')} />
      <SettingsBox>
        <SettingsInfo>{t('settings.onlyThisBrowserInfo')}</SettingsInfo>
        <Rule />
        <SettingsItem label={t('settings.language')}>
          <BasicDropdown
            options={languages}
            formatter={formatLanguage}
            value={i18n.resolvedLanguage}
            onSelect={changeLanguage}
          />
        </SettingsItem>
      </SettingsBox>
    </NavigationBarLayout>
  )
}

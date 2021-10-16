import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import SettingsBox from '../components/settings/SettingsBox'
import BasicDropdown from '../components/forms/BasicDropdown'
import SettingsItem from '../components/settings/SettingsItem'
import SettingsInfo from '../components/settings/SettingsInfo'

function formatLanguage (lang: string): string {
  return lang
}

export default function SettingsPage (): ReactElement {
  const { t, i18n } = useTranslation()

  const languages = i18n.options.resources != null
    ? Object.keys(i18n.options.resources)
    : []

  const changeLanguage = useCallback(async (value) => {
    await i18n.changeLanguage(value)
  }, [i18n])

  return (
    <NavigationBarLayout centered>
      <Title title={t('settings.title')} />
      <SettingsBox>
        <SettingsInfo>{t('settings.onlyThisBrowserInfo')}</SettingsInfo>
        <hr />
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

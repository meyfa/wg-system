import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faBroom, faCalendarAlt, faCog, faHome, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'

export interface NavItem {
  icon: IconDefinition
  label: string
  path: string
  end: boolean
}

export function useNavItems (): NavItem[] {
  const { t } = useTranslation()

  return useMemo(() => [
    { icon: faHome, label: t('home.title'), path: '/', end: true },
    { icon: faCalendarAlt, label: t('calendar.title'), path: '/calendar', end: false },
    { icon: faUsers, label: t('members.title'), path: '/members', end: true },
    { icon: faBroom, label: t('chores.title'), path: '/chores', end: true },
    { icon: faCog, label: t('settings.title'), path: '/settings', end: true }
  ], [t])
}

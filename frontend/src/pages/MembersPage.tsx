import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import GroupsSection from '../components/members/GroupsSection'
import MembersSection from '../components/members/MembersSection'

export default function MembersPage (): ReactElement {
  const { t } = useTranslation()

  return (
    <NavigationBarLayout centered>
      <Title title={t('members.title')} />
      <GroupsSection />
      <MembersSection />
    </NavigationBarLayout>
  )
}

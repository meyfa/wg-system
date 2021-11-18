import { ReactElement, useCallback } from 'react'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../store/store'
import { PeriodicChore, selectPeriodicChores } from '../store/entities/periodic-chores'
import { useEntityById } from '../hooks/use-entity-by-id'
import Title from '../components/Title'
import { useTranslation } from 'react-i18next'
import PeriodicChoreCalendar from '../components/calendar/PeriodicChoreCalendar'
import BasicDropdown from '../components/forms/BasicDropdown'
import Empty from '../components/Empty'

function formatChore (chore: PeriodicChore): string {
  return chore.name
}

export default function CalendarPage (): ReactElement {
  const { t } = useTranslation()

  const params = useParams<'choreId'>()

  const periodicChores = useAppSelector(selectPeriodicChores)
  const chore = useEntityById(selectPeriodicChores, params.choreId)

  const navigate = useNavigate()
  const handleSelect = useCallback((item: PeriodicChore) => {
    navigate(`/calendar/${item._id}`)
  }, [navigate])

  return (
    <NavigationBarLayout centered>
      <Title title={t('calendar.title')}>
        <BasicDropdown
          disabled={periodicChores.length === 0}
          options={periodicChores}
          formatter={formatChore}
          value={chore}
          onSelect={handleSelect}
        />
      </Title>
      {periodicChores.length === 0 ? <Empty message={t('calendar.empty.noChores')} /> : undefined}
      {periodicChores.length > 0 && chore == null ? <Empty message={t('calendar.empty.unselected')} /> : undefined}
      {chore != null ? <PeriodicChoreCalendar chore={chore} /> : undefined}
    </NavigationBarLayout>
  )
}

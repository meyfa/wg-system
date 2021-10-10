import { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Title from '../components/Title'
import NavigationBarLayout from '../layouts/NavigationBarLayout'
import { useAppSelector } from '../store/store'
import { ManualChore, selectManualChores } from '../store/entities/manual-chores'
import api from '../api/api'
import BasicButton from '../components/forms/BasicButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import EditManualChoreModal from '../components/garbage/EditManualChoreModal'
import ManualChoreItem from '../components/garbage/ManualChoreItem'
import { Scoreboard, selectScoreboards } from '../store/entities/scoreboards'
import ScoreboardItem from '../components/scoreboards/ScoreboardItem'
import EditScoreboardModal from '../components/scoreboards/EditScoreboardModal'

export default function GarbageDisposalPage (): ReactElement {
  const { t } = useTranslation()

  const manualChores = useAppSelector(selectManualChores)

  const [creating, setCreating] = useState(false)
  const showCreateModal = useCallback(() => setCreating(true), [])
  const hideCreateModal = useCallback(() => setCreating(false), [])

  const create = useCallback(async (entity: ManualChore) => {
    await api.manualChores.create(entity)
    setCreating(false)
  }, [])

  const scoreboards = useAppSelector(selectScoreboards)

  const [creatingScoreboard, setCreatingScoreboard] = useState(false)
  const showCreateScoreboardModal = useCallback(() => setCreatingScoreboard(true), [])
  const hideCreateScoreboardModal = useCallback(() => setCreatingScoreboard(false), [])

  const createScoreboard = useCallback(async (entity: Scoreboard) => {
    await api.scoreboards.create(entity)
    setCreatingScoreboard(false)
  }, [])

  return (
    <NavigationBarLayout centered>
      <Title title={t('garbage.title')}>
        <BasicButton onClick={showCreateModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </Title>
      <EditManualChoreModal active={creating} onSave={create} onCancel={hideCreateModal} />
      {manualChores.map(chore => <ManualChoreItem key={chore._id} chore={chore} />)}
      <Title minor title={t('scoreboards.title')}>
        <BasicButton onClick={showCreateScoreboardModal}>
          <FontAwesomeIcon icon={faPlus} />
          {t('basicActions.add')}
        </BasicButton>
      </Title>
      <EditScoreboardModal active={creatingScoreboard} onSave={createScoreboard} onCancel={hideCreateScoreboardModal} />
      {scoreboards.map(scoreboard => <ScoreboardItem key={scoreboard._id} scoreboard={scoreboard} />)}
    </NavigationBarLayout>
  )
}

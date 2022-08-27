import { ReactElement, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../store/store'
import { Scoreboard, selectScoreboards } from '../../store/entities/scoreboards'
import { api } from '../../api/api'
import EditScoreboardModal from './EditScoreboardModal'
import Empty from '../Empty'
import ScoreboardItem from './ScoreboardItem'
import Section from '../Section'
import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons'
import { EditModalRenderFn } from '../items/EditButton'

export default function ScoreboardsSection (): ReactElement {
  const { t } = useTranslation()

  const scoreboards = useAppSelector(selectScoreboards)

  const renderCreateModal: EditModalRenderFn = useCallback((active, hide) => {
    const create = (entity: Scoreboard): void => {
      void api.scoreboards.create(entity)
      hide()
    }
    return <EditScoreboardModal active={active} onSave={create} onCancel={hide} />
  }, [])

  return (
    <Section icon={faSortAmountUp} title={t('scoreboards.title')} renderCreateModal={renderCreateModal}>
      {scoreboards.length === 0 ? <Empty message={t('scoreboards.empty')} /> : undefined}
      {scoreboards.map(scoreboard => <ScoreboardItem key={scoreboard._id} scoreboard={scoreboard} />)}
    </Section>
  )
}

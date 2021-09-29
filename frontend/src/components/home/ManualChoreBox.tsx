import './ManualChoreBox.css'
import { ReactElement, useCallback } from 'react'
import { ManualChore } from '../../store/entities/manual-chores'
import ChoreBox from './ChoreBox'
import BasicButton from '../forms/BasicButton'
import { useTranslation } from 'react-i18next'
import api from '../../api/api'
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'

interface Props {
  chore: ManualChore
}

export default function ManualChoreBox (props: Props): ReactElement {
  const { t } = useTranslation()

  const isDue = props.chore.dueSince != null && props.chore.dueSince > 0

  const markDue = useCallback(async () => {
    await api.manualChores.update({
      ...props.chore,
      dueSince: Date.now()
    })
  }, [props.chore])

  const markDone = useCallback(async () => {
    await api.manualChores.update({
      ...props.chore,
      dueSince: 0
    })
  }, [props.chore])

  return (
    <ChoreBox className='ManualChoreBox' urgent={isDue}>
      <div className='ManualChoreBox-title'>
        <FontAwesomeIcon className={clsx('ManualChoreBox-icon', { good: !isDue, bad: isDue })}
                         icon={isDue ? faExclamationTriangle : faCheckCircle} />
        {props.chore.name}
      </div>
      <div className='ManualChoreBox-actions'>
        {isDue
          ? (<BasicButton onClick={markDone}>
            {t('home.chores.markDone')}
          </BasicButton>)
          : (<BasicButton onClick={markDue}>
            {t('home.chores.markDue')}
          </BasicButton>)
        }
      </div>
    </ChoreBox>
  )
}

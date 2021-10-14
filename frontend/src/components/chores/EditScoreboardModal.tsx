import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import TextField from '../forms/TextField'
import EditModal from '../modals/EditModal'
import { Scoreboard } from '../../store/entities/scoreboards'
import FormRow from '../forms/FormRow'
import { useScoreboardEditor } from '../../editors/use-scoreboard-editor'
import { useParametrized } from '../../util/use-parametrized'

interface Props {
  active: boolean
  scoreboard?: Scoreboard
  onSave: (entity: Scoreboard) => void
  onCancel: () => void
}

export default function EditScoreboardModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const editor = useScoreboardEditor(props.scoreboard)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  return (
    <EditModal title={props.scoreboard != null ? t('scoreboards.edit') : t('scoreboards.create')}
               active={props.active}
               isValid={editor.isValid}
               onSave={save}
               onCancel={props.onCancel}>
      <FormRow label={t('scoreboards.fields.name')}>
        <TextField
          value={editor.value.name}
          onChange={({ target }) => editor.update({ name: target.value })}
        />
      </FormRow>
    </EditModal>
  )
}

import { ReactElement, useEffect, useMemo } from 'react'
import EditModal from '../modals/EditModal'
import { useTranslation } from 'react-i18next'
import FormRow from '../forms/FormRow'
import { useAppSelector } from '../../store/store'
import { Member, selectMembers } from '../../store/entities/members'
import BasicDropdown from '../forms/BasicDropdown'
import { PeriodicChoreEntry } from '../../store/entities/periodic-chores'
import { useEntityById } from '../../hooks/use-entity-by-id'
import TextField from '../forms/TextField'
import { Editor, useEditor } from '../../editors/use-editor'
import { DateTime } from 'luxon'
import { useParametrized } from '../../hooks/use-parametrized'

const DEFAULT_ENTRY: PeriodicChoreEntry = {
  date: DateTime.now().toUTC().toISO(),
  memberId: ''
}

function useEntryEditor (value?: PeriodicChoreEntry): Editor<PeriodicChoreEntry> {
  const members = useAppSelector(selectMembers)

  return useEditor({
    value,
    default: DEFAULT_ENTRY,
    validate: entry => {
      return entry.date !== '' && DateTime.fromISO(entry.date, { zone: 'utc' }).isValid &&
        entry.memberId !== '' && members.some(member => member._id === entry.memberId)
    }
  })
}

function formatMember (option: Member): string {
  return option.name
}

function formatDate (date: string): string {
  return DateTime.fromISO(date, { zone: 'utc' }).toLocal().toFormat('yyyy-MM-dd')
}

interface Props {
  active: boolean
  entry?: PeriodicChoreEntry
  createForDate?: DateTime
  onDelete?: () => void
  onSave: (entry: PeriodicChoreEntry) => void
  onCancel: () => void
}

export default function EditEntryModal (props: Props): ReactElement {
  const { t } = useTranslation()

  const editor = useEntryEditor(props.entry)
  // reset editor when modal closes/opens
  useEffect(() => editor.reset(), [editor, props.active])

  const save = useParametrized(props.onSave, editor.value)

  useEffect(() => {
    if (props.entry == null && props.createForDate != null) {
      editor.update({ date: props.createForDate.toISO() ?? undefined })
    }
  }, [editor, props.entry, props.createForDate])

  const members = useAppSelector(selectMembers)
  const memberOptions = useMemo(() => {
    return members.filter(item => item.active || item._id === props.entry?.memberId)
  }, [members, props.entry?.memberId])
  const memberValue = useEntityById(selectMembers, editor.value.memberId)

  return (
    <EditModal
      active={props.active}
      title={props.entry == null ? t('calendar.create') : t('calendar.edit')}
      isValid={editor.isValid}
      onDelete={props.onDelete}
      onSave={save}
      onCancel={props.onCancel}
    >
      <FormRow label={t('calendar.fields.date')}>
        <TextField disabled value={formatDate(editor.value.date)} />
      </FormRow>
      <FormRow label={t('calendar.fields.member')}>
        <BasicDropdown
          options={memberOptions}
          formatter={formatMember}
          value={memberValue}
          onSelect={member => editor.update({ memberId: member._id })}
        />
      </FormRow>
    </EditModal>
  )
}

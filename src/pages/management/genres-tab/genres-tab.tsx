import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import {
  useCreateGenreMutation,
  useDeleteGenreMutation,
  useGetGenresQuery,
  useUpdateGenreMutation,
} from '../../../store/api/genres.api'
import { Button } from '../../../components/button/button'
import Input from '../../../components/input/input'
import Modal from '../../../components/modal/modal'
import ConfirmModal from '../../../components/confirm-modal/confirm-modal'
import { BRAND_BUTTON_BASE } from '../../../utils/tailwind-classes'
import { extractApiMessage } from '../../../utils/api-error'

interface GenreLite { id: number; title: string }

const GenresTab = () => {
  const { t } = useTranslation()
  const { data, isLoading, error } = useGetGenresQuery({ limit: 100 })
  const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation()
  const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation()
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation()

  const [newTitle, setNewTitle] = useState('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [editing, setEditing] = useState<GenreLite | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<GenreLite | null>(null)

  const genres = data?.data ?? []

  const handleCreate = async () => {
    setCreateError(null)
    const title = newTitle.trim()
    if (!title) return
    try {
      await createGenre({ title }).unwrap()
      setNewTitle('')
    } catch (err) {
      setCreateError(extractApiMessage(err) ?? t('management.genres.errorGeneric'))
    }
  }

  const startEdit = (genre: GenreLite) => {
    setEditing(genre)
    setEditingTitle(genre.title)
    setEditError(null)
  }

  const saveEdit = async () => {
    if (!editing) return
    setEditError(null)
    const title = editingTitle.trim()
    if (!title) return
    try {
      await updateGenre({ id: editing.id, title }).unwrap()
      setEditing(null)
    } catch (err) {
      setEditError(extractApiMessage(err) ?? t('management.genres.errorGeneric'))
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    await deleteGenre(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-3 max-w-xl">
        <div className="flex-1">
          <Input
            placeholder={t('management.genres.newPlaceholder')}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating || !newTitle.trim()}
          className={classNames(BRAND_BUTTON_BASE, 'h-10 px-5 rounded-lg text-sm')}
        >
          {isCreating ? t('common.loading') : t('management.genres.add')}
        </button>
      </div>
      {createError && <p className="text-xs text-red-500">{createError}</p>}

      {isLoading && <p className="text-sm text-app-text-muted">{t('common.loading')}</p>}
      {!!error && <p className="text-sm text-red-500">{t('management.loadError')}</p>}
      {!isLoading && !error && genres.length === 0 && (
        <p className="text-sm text-app-text-muted">
          {t('management.genres.noGenres')}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {genres.map((g) => (
          <div
            key={g.id}
            className="flex items-center gap-3 p-3 bg-app-soft border border-app-line rounded-xl"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{g.title}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                rounded="lg"
                onClick={() => startEdit(g)}
              >
                {t('common.edit')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                rounded="lg"
                onClick={() => setDeleting(g)}
              >
                {t('common.delete')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title={t('management.genres.editTitle')}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="h-10 px-5 rounded-full text-sm font-semibold border border-app-line text-app-text hover:bg-app-soft transition cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={isUpdating || !editingTitle.trim()}
                className={classNames(BRAND_BUTTON_BASE, 'h-10 px-5 rounded-full text-sm')}
              >
                {isUpdating ? t('common.loading') : t('common.save')}
              </button>
            </>
          }
        >
          <div className="flex flex-col gap-2">
            <span className="text-[11px] tracking-[0.16em] font-semibold text-app-text-muted uppercase">
              {t('management.genres.titleLabel')}
            </span>
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit()
              }}
              autoFocus
              className="h-11 px-3 rounded-lg bg-app-soft border border-app-line text-app-text text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          {editError && <p className="text-xs text-red-500">{editError}</p>}
        </Modal>
      )}

      {deleting && (
        <ConfirmModal
          title={t('management.genres.confirmDelete')}
          confirmLabel={t('common.delete')}
          loading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}

export default GenresTab

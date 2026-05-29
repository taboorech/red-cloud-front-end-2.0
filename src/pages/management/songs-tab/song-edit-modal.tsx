import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Modal from '../../../components/modal/modal'
import { useModerateUpdateSongMutation } from '../../../store/api/songs.api'
import { useGetGenresQuery } from '../../../store/api/genres.api'
import { BRAND_BUTTON_BASE } from '../../../utils/tailwind-classes'
import type { Song } from '../../../types/song.types'
import { extractApiMessage } from '../../../utils/api-error'

interface SongEditModalProps {
  song: Song
  onClose: () => void
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[11px] tracking-[0.16em] font-semibold text-app-text-muted uppercase">
    {children}
  </span>
)

const SongEditModal = ({ song, onClose }: SongEditModalProps) => {
  const { t } = useTranslation()
  const [moderateUpdate, { isLoading }] = useModerateUpdateSongMutation()
  const { data: genresResponse } = useGetGenresQuery({ limit: 100 })
  const allGenres = useMemo(() => genresResponse?.data ?? [], [genresResponse])

  const [title, setTitle] = useState(song.title)
  const [description, setDescription] = useState(song.description ?? '')
  const [language, setLanguage] = useState(song.language ?? '')
  const [isPublic, setIsPublic] = useState(song.is_public)
  const [genreIds, setGenreIds] = useState<number[]>(
    () => song.genres?.map((g) => g.id) ?? [],
  )
  const [error, setError] = useState<string | null>(null)

  const toggleGenre = (id: number) => {
    setGenreIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    )
  }

  const handleSave = async () => {
    setError(null)
    try {
      await moderateUpdate({
        songId: Number(song.id),
        title: title.trim(),
        description: description.trim() || undefined,
        language: language.trim() || undefined,
        isPublic,
        genres: genreIds,
      }).unwrap()
      onClose()
    } catch (err) {
      setError(extractApiMessage(err) ?? t('management.songs.errorGeneric'))
    }
  }

  return (
    <Modal
      title={t('management.songs.editTitle')}
      onClose={onClose}
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-full text-sm font-semibold border border-app-line text-app-text hover:bg-app-soft transition cursor-pointer"
          >
            {t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !title.trim()}
            className={classNames(BRAND_BUTTON_BASE, 'h-10 px-5 rounded-full text-sm')}
          >
            {isLoading ? t('common.loading') : t('common.save')}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <SectionLabel>{t('management.songs.titleLabel')}</SectionLabel>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11 px-3 rounded-lg bg-app-soft border border-app-line text-app-text text-sm focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>{t('management.songs.descriptionLabel')}</SectionLabel>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="px-3 py-2 rounded-lg bg-app-soft border border-app-line text-app-text text-sm focus:outline-none focus:border-brand-500 resize-y"
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>{t('management.songs.languageLabel')}</SectionLabel>
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="en, uk, ..."
          className="h-11 px-3 rounded-lg bg-app-soft border border-app-line text-app-text text-sm focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>{t('management.songs.visibilityLabel')}</SectionLabel>
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-brand-500 w-4 h-4 cursor-pointer"
          />
          <span className="text-sm text-app-text">
            {t('management.songs.isPublic')}
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>{t('management.songs.genresLabel')}</SectionLabel>
        {allGenres.length === 0 ? (
          <p className="text-sm text-app-text-muted">
            {t('management.genres.noGenres')}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allGenres.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                className={classNames(
                  'h-8 px-3 rounded-full text-xs font-medium border transition cursor-pointer',
                  genreIds.includes(g.id)
                    ? 'bg-brand-500/15 border-brand-500 text-brand-500'
                    : 'bg-app-soft border-app-line text-app-text hover:bg-app-elev',
                )}
              >
                {g.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </Modal>
  )
}

export default SongEditModal

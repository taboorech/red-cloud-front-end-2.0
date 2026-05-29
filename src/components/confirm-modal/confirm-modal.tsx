import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Modal from '../modal/modal'
import { BRAND_BUTTON_BASE } from '../../utils/tailwind-classes'

interface ConfirmModalProps {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal
      title={title}
      onClose={onCancel}
      maxWidth="max-w-sm"
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 px-5 rounded-full text-sm font-semibold border border-app-line text-app-text hover:bg-app-soft transition cursor-pointer disabled:opacity-60"
          >
            {cancelLabel ?? t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={classNames(
              'h-10 px-5 rounded-full text-sm font-semibold transition cursor-pointer disabled:opacity-60',
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-600 text-white border border-red-500'
                : `${BRAND_BUTTON_BASE} border border-brand-500`,
            )}
          >
            {loading
              ? t('common.loading')
              : confirmLabel ?? t('common.delete')}
          </button>
        </>
      }
    >
      {message && <p className="text-sm text-app-text-muted">{message}</p>}
    </Modal>
  )
}

export default ConfirmModal

import { useTranslation } from 'react-i18next'
import { IoClose } from 'react-icons/io5'
import classNames from 'classnames'

interface ModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

const Modal = ({
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidth = 'max-w-md',
}: ModalProps) => {
  const { t } = useTranslation()
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={classNames(
          'w-full rounded-2xl bg-app-elev border border-app-line shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto',
          maxWidth,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-app-text text-lg font-bold">{title}</h2>
            {subtitle && (
              <p className="text-app-text-muted text-sm mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md text-app-text-muted hover:text-app-text hover:bg-app-soft transition cursor-pointer shrink-0"
            aria-label={t('common.cancel')}
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {children}

        {footer && (
          <div className="flex items-center justify-end gap-2 flex-wrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal

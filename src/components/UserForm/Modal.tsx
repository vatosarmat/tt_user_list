import { useEffect } from 'react'

import IconButton from 'components/utils/IconButton'
import ReactPortal from 'components/utils/ReactPortal'
import { ReactComponent as Cross } from 'icons/x.svg'
import './Modal.css'

type ModalProps = {
  open: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ children, open, onClose }) => {
  // const nodeRef = useRef(null)

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.body.addEventListener('keydown', closeOnEscapeKey)
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey)
    }
  })

  if (!open) {
    return null
  }

  return (
    <ReactPortal domContainerId="modal-id">
      <div className="modal">
        <div className="modal__window">
          <div className="modal__header">
            <IconButton icon={Cross} onClick={onClose} />
          </div>
          <div className="modal__content">{children}</div>
        </div>
      </div>
    </ReactPortal>
  )
}

export default Modal

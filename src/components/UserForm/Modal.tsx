import { useLayoutEffect, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import IconButton from 'components/utils/IconButton'
import { ReactComponent as Cross } from 'icons/x.svg'
import './Modal.css'

type ReactPortalProps = {
  domContainerId: string
}

const ReactPortal: React.FC<ReactPortalProps> = ({ children, domContainerId }) => {
  const [domContainer, setDomContainer] = useState<HTMLElement | undefined>(undefined)

  useLayoutEffect(() => {
    let newElement: HTMLElement | null = null
    let element = document.getElementById(domContainerId)
    if (!element) {
      newElement = document.createElement('div')
      newElement.setAttribute('id', domContainerId)
      document.body.appendChild(newElement)
      element = newElement
    }
    setDomContainer(element)

    return () => {
      if (newElement && newElement.parentNode) {
        newElement.parentNode.removeChild(newElement)
      }
    }
  }, [domContainerId])

  if (!domContainer) return null

  return ReactDOM.createPortal(children, domContainer)
}

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

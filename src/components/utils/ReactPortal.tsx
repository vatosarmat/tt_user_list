import { useLayoutEffect, useState } from 'react'
import ReactDOM from 'react-dom'

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

export default ReactPortal

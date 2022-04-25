import { useEffect, createContext } from 'react'

import ReactPortal from 'components/utils/ReactPortal'

import './Snackbar.css'

type SnackbarProps = {
  text?: string
  timeout: number
  onTimeout: () => void
}

const Snackbar: React.FC<SnackbarProps> = ({ text, timeout, onTimeout }) => {
  useEffect(() => {
    if (text) {
      const t = setTimeout(onTimeout, timeout)
      return () => {
        clearTimeout(t)
      }
    }
  }, [text, onTimeout, timeout])

  if (!text) {
    return null
  }

  return (
    <ReactPortal domContainerId="snackbar-id">
      <div className="snackbar">
        <p className="text-normal">
          {text
            .split(/(\*\*.+?\*\*)/g)
            .filter(chunk => chunk)
            .map(chunk =>
              chunk.startsWith('**') && chunk.endsWith('**') ? (
                <span className="text-normal_bold">{chunk.slice(2, -2)}</span>
              ) : (
                <>{chunk}</>
              )
            )}
        </p>
      </div>
    </ReactPortal>
  )
}

export const SnackbarContext = createContext<(a: string) => void>(str => {})
export default Snackbar

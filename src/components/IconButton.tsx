import clsx from 'clsx'

import type { BlockProps } from 'util/common'
import './IconButton.css'

type IconButtonProps = BlockProps & {
  label: string
  icon: string
  onClick: () => void
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, onClick, classes }) => {
  return (
    <div className={clsx('back-button', classes)}>
      <button onClick={onClick}>{icon}</button>
      <h5>{label}</h5>
    </div>
  )
}

export default IconButton

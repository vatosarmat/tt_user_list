import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import type { BlockProps } from 'util/common'
import './BackButton.css'

type BackButtonProps = BlockProps & {}

const BackButton: React.FC<BackButtonProps> = ({ classes }) => {
  const navigate = useNavigate()
  return (
    <div className={clsx('back-button', classes)}>
      <button onClick={() => navigate(-1)}>{'<='}</button>
      <h5>Back</h5>
    </div>
  )
}

export default BackButton

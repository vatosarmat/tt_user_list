import type { BlockProps } from 'utils/common'
import './IconButton.css'

type IconButtonProps = BlockProps & {
  label?: string
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >
  onClick: () => void
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <button className="text-xlarge icon-button" onClick={onClick}>
      <Icon width="1.4em" height="1.4em" />
      {label && <h5 className="text-xlarge icon-button__label">{label}</h5>}
    </button>
  )
}

export default IconButton

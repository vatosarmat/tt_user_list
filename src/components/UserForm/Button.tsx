import clsx from 'clsx'
import './Button.css'

type ButtonProps = {
  label: string
  disabled?: boolean
  icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined
    }
  >
  onClick: React.MouseEventHandler<HTMLButtonElement> | 'submit'
  color?: 'neutral' | 'primary' | 'danger'
}

const Button: React.FC<ButtonProps> = ({ label, disabled, icon: Icon, onClick, color = 'neutral' }) => {
  const props = onClick === 'submit' ? { type: 'submit' as const } : { onClick, type: 'button' as const }
  return (
    <button disabled={disabled} className={clsx('button', 'text-normal', `button_color_${color}`)} {...props}>
      <Icon width="1em" height="1em" />
      {label}
    </button>
  )
}

export default Button

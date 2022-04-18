import './MainTitle.css'

type MainTitleProps = {
  text: string
}

const MainTitle: React.FC<MainTitleProps> = ({ text }) => <h2 className="main-title text-title">{text}</h2>

export default MainTitle

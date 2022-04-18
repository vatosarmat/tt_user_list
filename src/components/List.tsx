import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { UserInfo, StateContext } from 'state'
import './List.css'

type LinkButtonProps = {
  href: string
}

const LinkButton: React.FC<LinkButtonProps> = ({ href }) => {
  return (
    <Link className="text-normal link-button" to={href}>
      Details
    </Link>
  )
}

type ListItemProps = Pick<UserInfo, 'id' | 'fullName' | 'city' | 'company'>

const ListItem: React.FC<ListItemProps> = ({ id, fullName, city, company }) => {
  return (
    <li className="list-item">
      <div className="list-item__label text-light">full name:</div>
      <div className="list-item__value-fullname text-normal">{fullName}</div>
      <div className="list-item__label text-light">city:</div>
      <div className="list-item__value-city text-normal">{city}</div>
      <div className="list-item__label text-light">company:</div>
      <div className="list-item__value-company text-normal">{company}</div>
      <LinkButton href={id} />
    </li>
  )
}

const List: React.FC = () => {
  const { userInfoTable, userInfoSortKey } = useContext(StateContext)

  return (
    <ul className="list">
      {Object.values(userInfoTable)
        .sort((a, b) => {
          const aa = a[userInfoSortKey]
          const bb = b[userInfoSortKey]
          return aa > bb ? 1 : aa < bb ? -1 : 0
        })
        .map(item => (
          <ListItem {...item} key={item.id} />
        ))}
    </ul>
  )
}

export default List

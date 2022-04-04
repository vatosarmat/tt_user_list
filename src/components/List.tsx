import { useContext } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import { UserInfo, StateContext } from 'state'
import type { BlockProps } from 'util/common'
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
      {/*<div>*/}
      <LinkButton href={id} />
      {/*</div>*/}
    </li>
  )
}

type ListProps = BlockProps & {
  // items: DataItem[]
}

const List: React.FC<ListProps> = ({ classes }) => {
  const { userInfoTable, userInfoSortKey } = useContext(StateContext)

  return (
    <div className={clsx(classes)}>
      <h2 className="text-title list__title">User list</h2>
      <ul className="list__items">
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
    </div>
  )
}

export default List

import { useContext } from 'react'
import clsx from 'clsx'

import { State, StateContext, DispatchContext } from 'state'
import type { BlockProps } from 'util/common'
import RadioGroup from './RadioGroup'
import './Sort.css'

type SortProps = BlockProps & {}

const variants = ['fullName', 'city', 'company'] as const

const Sort: React.FC<SortProps> = ({ classes }) => {
  const sortKey = useContext(StateContext).userInfoSortKey
  const dispatch = useContext(DispatchContext)

  const setSortKey = (value: State['userInfoSortKey']) => {
    dispatch({ type: 'UserInfo/sortKey', payload: { userInfoSortKey: value } })
  }

  return (
    <div className={clsx('sort', classes)}>
      <h2 className="text-title sort__title">Sort by</h2>
      <RadioGroup variants={variants} name="user" value={sortKey} onChange={setSortKey} />
    </div>
  )
}

export default Sort

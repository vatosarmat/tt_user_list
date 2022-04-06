import type { Reducer } from 'react'
import { createContext } from 'react'

export type UserInfo = {
  id: string
  fullName: string
  userName: string
  email: string
  phone: string

  city: string
  street: string
  zipCode: string

  company: string
  website: string

  comment?: string
}

export type State = {
  nextUserInfoId: number
  userInfoTable: Record<string, UserInfo>
  userInfoSortKey: 'fullName' | 'city' | 'company'
}

export const initialState: State = {
  nextUserInfoId: 1,
  userInfoTable: {},
  userInfoSortKey: 'fullName'
}

type Action =
  | { type: 'UserInfo/sortKey'; payload: { userInfoSortKey: State['userInfoSortKey'] } }
  | { type: 'UserInfo/add'; payload: { userInfoData: Omit<UserInfo, 'id'> } }
  | { type: 'UserInfo/add_bulk'; payload: { userInfoDataArray: Omit<UserInfo, 'id'>[] } }
  | { type: 'UserInfo/remove'; payload: { userInfoId: string } }
  | { type: 'UserInfo/edit'; payload: { userInfoId: string; userInfoChange: Partial<Omit<UserInfo, 'id'>> } }

export const reducer: Reducer<State, Action> = (state, { type, payload }) => {
  switch (type) {
    case 'UserInfo/sortKey':
      return {
        ...state,
        userInfoSortKey: payload.userInfoSortKey
      }
    case 'UserInfo/add': {
      const id = state.nextUserInfoId.toString()
      return {
        ...state,
        nextUserInfoId: state.nextUserInfoId + 1,
        userInfoTable: {
          ...state.userInfoTable,
          [id]: {
            ...payload.userInfoData,
            id
          }
        }
      }
    }
    case 'UserInfo/add_bulk': {
      const ar = payload.userInfoDataArray
      const id = state.nextUserInfoId
      const newUserInfoTable = { ...state.userInfoTable }

      for (let i = 0; i < ar.length; i++) {
        const idStr = (id + i).toString()
        newUserInfoTable[idStr] = { ...ar[i], id: idStr }
      }

      return {
        ...state,
        nextUserInfoId: state.nextUserInfoId + ar.length,
        userInfoTable: newUserInfoTable
      }
    }
    case 'UserInfo/remove':
      return {
        ...state,
        userInfoTable: Object.fromEntries(
          Object.entries(state.userInfoTable).filter(([id, item]) => id !== payload.userInfoId)
        )
      }
    case 'UserInfo/edit':
      return {
        ...state,
        userInfoTable: {
          ...state.userInfoTable,
          [payload.userInfoId]: Object.assign(state.userInfoTable[payload.userInfoId], payload.userInfoChange)
        }
      }
  }
}

export const StateContext = createContext(initialState)
export const DispatchContext = createContext((a: Action) => {})

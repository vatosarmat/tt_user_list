import { useCallback, useState, useContext, useRef, createContext } from 'react'
import clsx from 'clsx'

import { StateContext, DispatchContext, State, UserInfo } from 'state'
import type { BlockProps } from 'util/common'
import './UserForm.css'

type FormContextValue = {
  register: (name: string, input: HTMLInputElement | HTMLTextAreaElement) => void
  disabled?: boolean
  defaultRecord?: Record<string, string>
}

const FormContext = createContext<FormContextValue>({ register: () => {}, disabled: false, defaultRecord: {} })

type FormFieldProps = {
  name: string
  multiline?: boolean
  label?: string
  defaultValue?: string
}

const FormField: React.FC<FormFieldProps> = ({ name, multiline = false, label, defaultValue }) => {
  const { register, disabled, defaultRecord } = useContext(FormContext)
  const registerInput = useCallback(
    (input: null | HTMLInputElement | HTMLTextAreaElement) => {
      if (input) {
        register(name, input)
      }
    },
    [name, register]
  )

  if (!label) {
    let nameAr = name.match(/[A-Z][a-z]+|[a-z]+/g)
    if (nameAr && nameAr.length > 1) {
      nameAr = [nameAr[0][0].toUpperCase() + nameAr[0].slice(1), ...nameAr.slice(1).map(w => w.toLowerCase())]
      label = nameAr.join(' ')
    } else {
      label = name[0].toUpperCase() + name.slice(1)
    }
  }

  if (!defaultValue) {
    defaultValue = defaultRecord ? defaultRecord[name as keyof State] : undefined
  }

  const props = { name, ref: registerInput, defaultValue, disabled }

  return (
    <label className="user-form-field">
      <span className="text-label">{label}</span>
      {multiline ? <textarea {...props} /> : <input type="text" {...props} />}
    </label>
  )
}

const useFormFields = () => {
  const fieldsRef = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement>>({})
  const register = useCallback((name: string, inputEl: HTMLInputElement | HTMLTextAreaElement) => {
    fieldsRef.current[name] = inputEl
  }, [])

  return [fieldsRef, register] as const
}

type UserFormPropsCommon = BlockProps & { disabled?: boolean; defaultRecord?: Record<string, string> }

const UserFormCommon: React.FC<UserFormPropsCommon> = ({ classes, children }) => {
  return (
    <div className={clsx('user-form', classes)}>
      <h2 className="text-title user-form__title">User list</h2>
      <form className="user-form__form">
        <FormField name="fullName" />
        <FormField name="userName" />
        <FormField name="email" />
        <FormField name="phone" />
        <FormField name="city" />
        <FormField name="street" />
        <FormField name="zipCode" />
        <FormField name="company" />
        <FormField name="website" />
        <FormField name="comment" multiline />
      </form>
      {children}
    </div>
  )
}

type UserFormEditProps = BlockProps & { id: string }

const UserFormEdit: React.FC<UserFormEditProps> = ({ id, ...props }) => {
  const [readOnly, setReadOnly] = useState(true)
  const userInfo = useContext(StateContext).userInfoTable[id]
  const dispatch = useContext(DispatchContext)
  const [fieldsRef, register] = useFormFields()

  const onApplyEdit: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    const newUserInfo: Record<string, string> = {}
    for (const [name, inputEl] of Object.entries(fieldsRef.current)) {
      newUserInfo[name] = inputEl.value
    }
    dispatch({ type: 'UserInfo/edit', payload: { userInfoId: id, userInfoChange: newUserInfo } })
  }, [id, dispatch, fieldsRef])

  const formContext: FormContextValue = { register, disabled: readOnly, defaultRecord: userInfo }

  return (
    <FormContext.Provider value={formContext}>
      <UserFormCommon {...props}>
        {readOnly ? (
          <button
            className="user-form__edit"
            onClick={() => {
              setReadOnly(false)
            }}
          >
            Edit
          </button>
        ) : (
          <div>
            <button className="user-form__apply" onClick={onApplyEdit}>
              Apply
            </button>
            <button
              className="user-form__cancel"
              onClick={() => {
                setReadOnly(true)
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </UserFormCommon>
    </FormContext.Provider>
  )
}

type UserFormAddProps = BlockProps & {}

const UserFormAdd: React.FC<UserFormAddProps> = props => {
  const dispatch = useContext(DispatchContext)
  const [fieldsRef, register] = useFormFields()

  const onSubmit: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    evt => {
      const userInfo: Record<string, string> = {}
      for (const [name, inputEl] of Object.entries(fieldsRef.current)) {
        userInfo[name] = inputEl.value
      }

      dispatch({ type: 'UserInfo/add', payload: { userInfoData: userInfo as Omit<UserInfo, 'id'> } })
    },
    [dispatch, fieldsRef]
  )

  return (
    <FormContext.Provider value={{ register }}>
      <UserFormCommon {...props}>
        <button className="user-form__submit" onClick={onSubmit}>
          Submit
        </button>
      </UserFormCommon>
    </FormContext.Provider>
  )
}

type UserFormProps = BlockProps & { id?: string }

const UserForm: React.FC<UserFormProps> = ({ id, ...rest }) => {
  return id ? <UserFormEdit id={id} {...rest} /> : <UserFormAdd {...rest} />
}

export default UserForm

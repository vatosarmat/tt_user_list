import { useState, useContext, useRef, createContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { StateContext, DispatchContext, State, UserInfo } from 'state'
import type { BlockProps } from 'utils/common'
import { ReactComponent as Check } from 'icons/check.svg'
import { ReactComponent as Pencil } from 'icons/pencil.svg'
import { ReactComponent as Trash } from 'icons/trash.svg'
import { ReactComponent as Cross } from 'icons/x.svg'
import { ReactComponent as Plus } from 'icons/plus.svg'
import './UserForm.css'

type FormContextValue = {
  register: (name: string, input: HTMLInputElement | HTMLTextAreaElement) => void
  disabled?: boolean
  defaultRecord?: Record<string, string>
}

const FormContext = createContext<FormContextValue>({ register: () => {}, disabled: false, defaultRecord: {} })

type ValidPattern = {
  pattern: string
  description: string
}

type FormFieldProps = {
  name: string
  required?: boolean
  validPattern?: ValidPattern
  title?: string
  multiline?: boolean
  label?: string
  defaultValue?: string
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  required = false,
  multiline = false,
  validPattern,
  label,
  defaultValue
}) => {
  const { register, disabled, defaultRecord } = useContext(FormContext)
  const registerInput = (input: null | HTMLInputElement | HTMLTextAreaElement) => {
    if (input) {
      register(name, input)
    }
  }

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

  const props = {
    name,
    required,
    ref: registerInput,
    defaultValue,
    disabled,
    ...(validPattern ? { title: validPattern.description, pattern: validPattern.pattern } : {})
  }

  return (
    <label className="user-form-field">
      <span className="text-label">{label}</span>
      {multiline ? <textarea {...props} /> : <input type={name === 'email' ? 'email' : 'text'} {...props} />}
    </label>
  )
}

const useFormFields = () => {
  const fieldsRef = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement>>({})
  const register = (name: string, inputEl: HTMLInputElement | HTMLTextAreaElement) => {
    fieldsRef.current[name] = inputEl
  }

  return [fieldsRef, register] as const
}

type UserFormPropsCommon = BlockProps & {
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

const UserFormCommon: React.FC<UserFormPropsCommon> = ({ onSubmit, classes, children: buttons }) => {
  const namePattern = {
    pattern: /\p{L}[\p{L}.' -]+[\p{L}.]/.source,
    description: `Unicode letters, <'>, <->, <.> and < > allowed`
  }
  const companyPattern = {
    pattern: /\S.*/.source,
    description: `Must not be whitespace`
  }
  return (
    <form className={clsx('user-form', classes)} onSubmit={onSubmit}>
      <div className="user-form__fields">
        <FormField name="fullName" required validPattern={namePattern} />
        <FormField name="email" required />
        <FormField name="city" required validPattern={namePattern} />
        <FormField name="company" required validPattern={companyPattern} />
        <FormField name="comment" multiline />
      </div>
      {buttons}
    </form>
  )
}

type UserFormEditProps = BlockProps & { id: string }

const UserFormEdit: React.FC<UserFormEditProps> = ({ id, ...props }) => {
  const [readOnly, setReadOnly] = useState(true)
  const userInfo = useContext(StateContext).userInfoTable[id]
  const dispatch = useContext(DispatchContext)
  const [fieldsRef, register] = useFormFields()
  const navigate = useNavigate()

  const onApplyEdit: UserFormPropsCommon['onSubmit'] = evt => {
    const newUserInfo: Record<string, string> = {}
    for (const [name, inputEl] of Object.entries(fieldsRef.current)) {
      newUserInfo[name] = inputEl.value.trim()
    }
    dispatch({ type: 'UserInfo/edit', payload: { userInfoId: id, userInfoChange: newUserInfo } })
    setReadOnly(true)
    evt.preventDefault()
  }

  const onRemove: React.MouseEventHandler<HTMLButtonElement> = evt => {
    navigate('/')
    dispatch({ type: 'UserInfo/remove', payload: { userInfoId: id } })
    evt.preventDefault()
  }

  const formContext: FormContextValue = { register, disabled: readOnly, defaultRecord: userInfo }

  return (
    <FormContext.Provider value={formContext}>
      <UserFormCommon onSubmit={onApplyEdit} {...props}>
        {readOnly ? (
          <div className="user-form__buttons">
            <button
              type="button"
              className="text-normal user-form__edit"
              onClick={evt => {
                setReadOnly(false)
                evt.preventDefault()
              }}
            >
              <Pencil width="1em" height="1em" />
              Edit
            </button>
          </div>
        ) : (
          <div className="user-form__buttons">
            <button type="submit" className="text-normal user-form__apply">
              <Check width="1em" height="1em" />
              Apply
            </button>
            <button type="button" className="text-normal user-form__remove" onClick={onRemove}>
              <Trash width="1em" height="1em" />
              Remove
            </button>
            <button
              type="button"
              className="text-normal user-form__cancel"
              onClick={evt => {
                setReadOnly(true)
                evt.preventDefault()
              }}
            >
              <Cross width="1em" height="1em" />
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
  const addedId = useContext(StateContext).nextUserInfoId.toString()
  const dispatch = useContext(DispatchContext)
  const [didAdded, setDidAdded] = useState<string | undefined>(undefined)
  const [fieldsRef, register] = useFormFields()

  const onSubmit: UserFormPropsCommon['onSubmit'] = evt => {
    const userInfo: Record<string, string> = {}
    for (const [name, inputEl] of Object.entries(fieldsRef.current)) {
      userInfo[name] = inputEl.value
    }

    dispatch({ type: 'UserInfo/add', payload: { userInfoData: userInfo as Omit<UserInfo, 'id'> } })
    setDidAdded(addedId)
  }

  if (didAdded) {
    return <Navigate to={'/' + didAdded} />
  }

  return (
    <FormContext.Provider value={{ register }}>
      <UserFormCommon onSubmit={onSubmit} {...props}>
        <div className="user-form__buttons">
          <button type="submit" className="text-normal user-form__apply">
            <Plus width="1em" height="1em" />
            Submit
          </button>
        </div>
      </UserFormCommon>
    </FormContext.Provider>
  )
}

type UserFormProps = BlockProps & { id?: string }

const UserForm: React.FC<UserFormProps> = ({ id, ...rest }) => {
  return id ? <UserFormEdit id={id} {...rest} /> : <UserFormAdd {...rest} />
}

export default UserForm

import { useCallback, useContext, useRef, createContext } from 'react'
import clsx from 'clsx'

import { StateContext, State } from 'state'
import type { BlockProps } from 'util/common'
import './UserForm.css'

type FormContextValue = {
  register: (name: string, input: HTMLInputElement | HTMLTextAreaElement) => void
  disabled: boolean
  defaultRecord: Record<string, string>
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
  const registerInput = useCallback((input: null | HTMLInputElement | HTMLTextAreaElement) => {
    if (input) {
      register(name, input)
    }
  }, [])

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
    defaultValue = name as keyof State
  }

  return (
    <label className="user-form-field">
      <span className="text-label">{label}</span>
      {multiline ? (
        <textarea disabled={disabled} name={name} ref={registerInput} defaultValue={defaultRecord[name]} />
      ) : (
        <input type="text" disabled={disabled} name={name} ref={registerInput} defaultValue={defaultRecord[name]} />
      )}
    </label>
  )
}

type UserFormProps = BlockProps & { id: string }

const UserForm: React.FC<UserFormProps> = ({ classes, id }) => {
  const userInfo = useContext(StateContext).userInfoTable[id]
  const fieldsRef = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement>>({})
  const register = useCallback((name: string, inputEl: HTMLInputElement | HTMLTextAreaElement) => {
    fieldsRef.current[name] = inputEl
  }, [])

  const onSubmit: React.MouseEventHandler<HTMLButtonElement> = useCallback(evt => {
    const userInfo: Record<string, string> = {}
    for (const [name, inputEl] of Object.entries(fieldsRef.current)) {
      userInfo[name] = inputEl.value
    }
    console.log(userInfo)
  }, [])

  return (
    <div className={clsx('user-form', classes)}>
      <h2 className="text-title user-form__title">User list</h2>
      <form className="user-form__form">
        <FormContext.Provider value={{ register, disabled: false, defaultRecord: userInfo }}>
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
        </FormContext.Provider>
      </form>
      <button className="user-form__submit" onClick={onSubmit}>
        Submit
      </button>
    </div>
  )
}

export default UserForm

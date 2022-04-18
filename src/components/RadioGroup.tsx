import './RadioGroup.css'

type RadioGroupProps<V extends string> = {
  name: string
  variants: readonly V[]
  value: V
  onChange: (value: V) => void
}

const convertCase = (str: string) => {
  str = str.replaceAll(/(\p{Ll})(\p{Lu})/gu, '$1 $2').toLocaleLowerCase()
  return str[0].toLocaleUpperCase() + str.slice(1)
}

const RadioGroup = <V extends string>({ name, variants, value, onChange: onChangeProp }: RadioGroupProps<V>) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    if (event.target.checked) {
      onChangeProp(event.target.value as V)
    }
  }

  return (
    <div className="radio-group">
      {variants.map(valueVariant => (
        <label key={valueVariant} className="text-large radio">
          <input
            type="radio"
            className="radio__input"
            name={name}
            value={valueVariant}
            checked={valueVariant === value}
            onChange={onChange}
          />
          <span className="radio__label-text">{convertCase(valueVariant)}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioGroup

import './RadioGroup.css'

type RadioGroupProps<V extends string> = {
  name: string
  variants: readonly V[]
  value: V
  onChange: (value: V) => void
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
        <label key={valueVariant} className="radio">
          <input
            type="radio"
            className="radio__input"
            name={name}
            value={valueVariant}
            checked={valueVariant === value}
            onChange={onChange}
          />
          <span className="text-normal radio__label-text">{valueVariant}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioGroup

import React, { useState } from "react"
import { Combobox, InputBase, Input, useCombobox } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"

export default function InputCombobox({
  items,
  label,
  name,
  placeholder,
  errors,
  setValue,
  disabled = false,
  nothingFoundMessage = "Sin opciones disponibles"
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [inputValue, setInputValue] = useState(null)

  let options

  if (items && items.length > 0) {
    options = items.map((item) => (
      <Combobox.Option value={item.value} key={item.value}>
        {item.label}
      </Combobox.Option>
    ))
  } else {
    options = (
      <Combobox.Option disabled value="no_drivers">
        {nothingFoundMessage}
      </Combobox.Option>
    )
  }
  const selectedOption = items?.find((item) => item?.value === inputValue)

  return (
    <React.Fragment>
      <div className="flex flex-col py-1">
        <span className="text-sm leading-snug pb-1">{label}</span>
        <Combobox
          disabled={disabled}
          store={combobox}
          onOptionSubmit={(val) => {
            setValue(name, val)
            setInputValue(val)
            combobox.closeDropdown()
          }}>
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.toggleDropdown()}>
              {selectedOption ? selectedOption.label : ''}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
              {options}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </React.Fragment>
  )
}

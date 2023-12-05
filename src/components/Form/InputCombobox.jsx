import React, { useState } from "react"
import { Combobox, InputBase, Input, useCombobox } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"

export default function InputCombobox({ items, label, name, placeholder, errors, setValue, disabled = false }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [inputValue, setInputValue] = useState(null)

  const options = items.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ))

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <span className="text-sky-950 text-sm font-bold leading-snug pb-1">{label}</span>
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
              {inputValue || <Input.Placeholder>{placeholder}</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{options}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </React.Fragment>
  )
}

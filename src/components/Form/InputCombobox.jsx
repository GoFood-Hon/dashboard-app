import React, { useState } from "react"
import { Combobox, InputBase, Input, useCombobox } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"

export default function InputCombobox({ items, label, name, placeholder, errors }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [value, setValue] = useState(null)

  const options = items.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ))

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <span className="text-sky-950 text-sm font-bold leading-snug pb-1">{label}</span>
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            setValue(val)
            combobox.closeDropdown()
          }}>
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.toggleDropdown()}>
              {value || <Input.Placeholder>{placeholder}</Input.Placeholder>}
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

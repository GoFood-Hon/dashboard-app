import React, { useState } from "react"
import { InputBase, Combobox, useCombobox } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"

export default function InputCombobox({ items, label, errors, register, name, placeholder }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [value, setValueState] = useState("")
  const [search, setSearch] = useState("")

  const shouldFilterOptions = items.every((item) => item !== search)
  const filteredOptions = shouldFilterOptions
    ? items.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    : items

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ))

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <span className="text-slate-400 pb-1">{label}</span>
        <Combobox
          store={combobox}
          onOptionSubmit={(val) => {
            setValueState(val)
            setSearch(val)
            combobox.closeDropdown()
          }}>
          <Combobox.Target>
            <InputBase
              size={"md"}
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              onBlur={() => {
                combobox.closeDropdown()
                setSearch(value || "")
              }}
              placeholder={placeholder}
              value={search}
              onChange={(event) => {
                combobox.updateSelectedOptionIndex()
                setSearch(event.currentTarget.value)
              }}
              {...register(name)}
            />
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </React.Fragment>
  )
}

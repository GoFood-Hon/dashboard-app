import React, { useRef, useState } from "react"
import { InputBase, Combobox, useCombobox } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"

export default function InputCombobox({ items, label, errors, register, name, placeholder, emptyMessage, setValue }) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [value, setValueState] = useState("")
  const [search, setSearch] = useState("")
  const categoryIdRef = useRef(null)

  const shouldFilterOptions = items.every((item) => item.name !== search)
  const filteredOptions = shouldFilterOptions
    ? items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase().trim()))
    : items

  const options = filteredOptions.map((item) => (
    <Combobox.Option
      value={item.name}
      key={item.id}
      selected={categoryIdRef.current === item}
      ref={() => {
        categoryIdRef.current = item
      }}>
      {item.name}
    </Combobox.Option>
  ))

  const handleComboboxSubmit = (val) => {
    setValueState(val)
    setSearch(val)
    if (categoryIdRef.current) {
      setValue(name, categoryIdRef.current.id)
    }
    combobox.closeDropdown()
  }

  return (
    <React.Fragment>
      <div className="flex flex-col">
        <span className="text-slate-400 pb-1">{label}</span>
        <Combobox store={combobox} onOptionSubmit={handleComboboxSubmit}>
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
            />
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>{options.length > 0 ? options : <Combobox.Empty>{emptyMessage}</Combobox.Empty>}</Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </React.Fragment>
  )
}

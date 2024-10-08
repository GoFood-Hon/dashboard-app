import React, { useEffect, useRef, useState } from "react"
import { InputBase, Combobox, useCombobox } from "@mantine/core"
import { ErrorMessage } from "./ErrorMessage"
import LoadingCircle from "../LoadingCircle"
import { colors } from "../../theme/colors"

export default function InputSearchCombobox({ items, label, errors, name, placeholder, emptyMessage, setValue, status }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
    }
  })

  const shouldFilterOptions = items.every((item) => item.name !== search)
  const filteredOptions = shouldFilterOptions
    ? items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase().trim()))
    : items

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.name} key={item.id} color={colors.primary_button} selected={selectedCategory === item}>
      {item.name}
    </Combobox.Option>
  ))

  const handleComboboxSubmit = (val) => {
    setSearch(val)

    const selectedOption = filteredOptions.find((item) => item.name === val)
    if (selectedOption) {
      setSelectedCategory(selectedOption)
      setValue(name, selectedOption.id)
    }
    combobox.closeDropdown()
  }

  useEffect(() => {
    setSearch("")
  }, [items])

  return (
    <React.Fragment>
      <div className="flex flex-col my-2">
        <span className="text-sm font-bold leading-snug pb-1">{label}</span>
        <Combobox store={combobox} onOptionSubmit={handleComboboxSubmit}>
          <Combobox.Target>
            <InputBase
              size={"md"}
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.openDropdown()}
              onFocus={() => combobox.openDropdown()}
              placeholder={placeholder}
              value={search}
              onChange={(event) => {
                combobox.updateSelectedOptionIndex()
                setSearch(event.currentTarget.value)
              }}
            />
          </Combobox.Target>
          <Combobox.Dropdown>
            <Combobox.Options>
              {options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>
                  {status === "loading" ? (
                    <div className="flex flex-col items-center justify-center">
                      <LoadingCircle />
                      <span>Cargando opciones...</span>
                    </div>
                  ) : (
                    emptyMessage
                  )}
                </Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <ErrorMessage message={errors?.[name]?.message} />
      </div>
    </React.Fragment>
  )
}

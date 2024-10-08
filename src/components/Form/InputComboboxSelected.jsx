import { Button, Combobox, useCombobox } from "@mantine/core"
import React from "react"
import { colors } from "../../theme/colors"

export const InputComboboxSelected = ({ items, label, name, register, setValue }) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })
  const options = items.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ))

  return (
    <div className="flex flex-col item-center w-full h-full flex-wrap">
      <label className="mr-3">{label}</label>
      <div className="flex flex-row items-center gap-2">
        <input
          className="mt-1 p-2 appearance-none block w-20 border rounded focus:outline-none "
          {...register(name)}
          disabled
        />
        <label >minutos</label>
      </div>

      <Combobox
        store={combobox}
        width={250}
        position="bottom-start"
        withArrow
        onOptionSubmit={(val) => {
          setValue(name, val)
          combobox.closeDropdown()
        }}>
        <Combobox.Target>
          <Button w={"200px"} className="w-10 my-2" color={colors.main_app_color} onClick={() => combobox.toggleDropdown()}>
            Seleccionar tiempo
          </Button>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  )
}

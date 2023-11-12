import { Input, NumberInput, Popover, RangeSlider, Select } from "@mantine/core"
import React from "react"
import { DatePickerInput } from "@mantine/dates"
import { Icon } from "./Icon"
import { colors } from "../theme/colors"
import Button from "./Button"

export default function FilterPopover() {
  const marks = [
    { value: 20, label: "20%" },
    { value: 50, label: "50%" },
    { value: 80, label: "80%" }
  ]

  return (
    <Popover width={300} position="bottom" withArrow shadow="md" radius={20} offset={{ mainAxis: 2, crossAxis: -100 }}>
      <Popover.Target>
        <span className="cursor-pointer">
          <Icon icon="setting" size={20} />
        </span>
      </Popover.Target>
      <Popover.Dropdown className="p-0" p={0}>
        <h1 className="p-3 text-sky-950 font-bold pb-3 border-b-[0.50px] border-blue-100">Filtros</h1>
        <section className="border-b-[0.50px] border-blue-100">
          <div className="flex flex-row justify-between p-4 text-sm">
            <p>Rango de fechas</p>
            <p>Reiniciar</p>
          </div>
          <div className="flex flex-row justify-between text-xs gap-2 p-4 pt-0 border-b-[0.50px] border-blue-100">
            <DatePickerInput size="xs" label="Desde" placeholder="Seleccionar fecha" popoverProps={{ withinPortal: false }} />
            <DatePickerInput size="xs" label="Hasta" placeholder="Seleccionar fecha" popoverProps={{ withinPortal: false }} />
          </div>
        </section>
        <section className="border-b-[0.50px] border-blue-100">
          <div className="flex flex-row justify-between p-4 pb-1 text-sm">
            <p>Estados</p>
            <p>Reiniciar</p>
          </div>
          <Select
            size="xs"
            className="p-4 pt-0"
            placeholder="Seleccione estado"
            comboboxProps={{ withinPortal: false }}
            data={["Todos", "Habilitado", "Deshabilitado"]}
          />
        </section>
        <section className="border-b-[0.50px] border-blue-100">
          <div className="flex flex-row justify-between p-4 pb-1 text-sm">
            <p>Total venta</p>
            <p>Reiniciar</p>
          </div>
          <div className="p-4 pt-0">
            <div className="flex flex-row gap-2 pb-3">
              <Input.Wrapper label="Desde" size="12px">
                <NumberInput placeholder="120.00" leftSection={<Icon icon="money" size={16} />} />
              </Input.Wrapper>
              <Input.Wrapper label="Hasta" size="12px">
                <NumberInput placeholder="500.00" leftSection={<Icon icon="money" size={16} />} />
              </Input.Wrapper>
            </div>
            <div className="pt-2 pb-4">
              <RangeSlider defaultValue={[20, 80]} marks={marks} color={colors.primary_button} />
            </div>
          </div>
        </section>
        <section>
          <div className="flex flex-row gap-2 p-4">
            <Button
              text="Borrar Filtros"
              className="rounded border border-sky-950 justify-center items-center gap-2.5 inline-flex"
            />
            <Button
              text="Aplicar Filtros"
              className="bg-sky-950 rounded justify-center items-center gap-2.5 inline-flex"
              textClassName="text-white"
            />
          </div>
        </section>
      </Popover.Dropdown>
    </Popover>
  )
}

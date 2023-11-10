import { Group, Popover, Radio } from "@mantine/core"
import React, { useState } from "react"
import { Icon } from "../../../components/Icon"
import { colors } from "../../../theme/colors"
import Button from "../../../components/Button"

export default function SortDishesPopover() {
  const [checked, setChecked] = useState(false)

  return (
    <Popover width={300} position="bottom" withArrow shadow="md" radius={20} offset={{ mainAxis: 2, crossAxis: -130 }}>
      <Popover.Target>
        <span className="cursor-pointer">
          <Icon icon="dots" size={20} />
        </span>
      </Popover.Target>
      <Popover.Dropdown className="p-0" p={0}>
        <h1 className="p-3 text-sky-950 font-bold pb-3 border-b-[0.50px] border-blue-100">Ordenar por</h1>
        <section className="border-b-[0.50px] border-blue-100">
          <div className="flex flex-row justify-between p-4 text-sm py-2">
            <p>Id</p>
            <p>Reiniciar</p>
          </div>
          <div className="flex flex-col p-4 gap-2 pt-0">
            <Radio
              value="ASC"
              label="Ascendente"
              color={colors.primary_text}
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
            />
            <Radio
              value="DESC"
              label="Descendente"
              color={colors.primary_text}
              checked={!checked}
              onChange={(event) => setChecked(!event.currentTarget.checked)}
            />
          </div>
        </section>
        <section className="border-b-[0.50px] border-blue-100">
          <div className="flex flex-row justify-between p-4 py-2 text-sm">
            <p>Usuario</p>
            <p>Reiniciar</p>
          </div>
          <div className="flex flex-col p-4 gap-2 pt-0">
            <Radio
              value="ASC"
              label="Ascendente"
              color={colors.primary_text}
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
            />
            <Radio
              value="DESC"
              label="Descendente"
              color={colors.primary_text}
              checked={!checked}
              onChange={(event) => setChecked(!event.currentTarget.checked)}
            />
          </div>
        </section>
        <section className="border-b-[0.50px] border-blue-100">
          <div className="flex flex-row justify-between p-4 py-2 text-sm">
            <p>Fecha</p>
            <p>Reiniciar</p>
          </div>
          <div className="flex flex-col p-4 gap-2 pt-0">
            <Radio
              value="ASC"
              label="Ascendente"
              color={colors.primary_text}
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
            />
            <Radio
              value="DESC"
              label="Descendente"
              color={colors.primary_text}
              checked={!checked}
              onChange={(event) => setChecked(!event.currentTarget.checked)}
            />
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

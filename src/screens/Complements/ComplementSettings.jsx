import { Radio } from "@mantine/core"
import React, { useState } from "react"
import { colors } from "../../theme/colors"

export default function ComplementSettings() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-blue-100 p-4">
      <span className="text-sky-950 text-sm font-bold leading-snug">
        Disponibilidad en platillos<span className="text-sky-950 text-sm font-normal">( Opcional )</span>
      </span>
      <div className="flex flex-col gap-2 pt-4">
        <Radio
          value="none"
          label="Ninguna"
          color={colors.primary_text}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <Radio
          value="choose"
          label="Elige los platillos"
          color={colors.primary_text}
          checked={!checked}
          onChange={(event) => setChecked(!event.currentTarget.checked)}
        />
        <Radio
          value="default"
          label="Por defecto en todos los platillos"
          color={colors.primary_text}
          checked={checked}
          onChange={(event) => setChecked(!event.currentTarget.checked)}
        />
      </div>
    </div>
  )
}

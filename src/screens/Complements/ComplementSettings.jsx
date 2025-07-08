import { Radio } from "@mantine/core"
import React, { useState } from "react"
import { colors } from "../../theme/colors"

export default function ComplementSettings({ setValue }) {
  const [selectedOption, setSelectedOption] = useState("none")

  const handleRadioChange = (value) => {
    setSelectedOption(value)
    setValue("availability", value)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl border border-blue-100 p-4">
      <span className="text-sky-950 text-sm font-bold leading-snug">
        Disponibilidad en productos<span className="text-sky-950 text-sm font-normal">( Opcional )</span>
      </span>
      <div className="flex flex-col gap-2 pt-4">
        <Radio
          value="none"
          label="Ninguna"
          color={colors.primary_text}
          checked={selectedOption === "none"}
          onChange={() => handleRadioChange("none")}
        />
        <Radio
          value="choose"
          label="Elige los productos"
          color={colors.primary_text}
          checked={selectedOption === "choose"}
          onChange={() => handleRadioChange("choose")}
        />
        <Radio
          value="default"
          label="Por defecto en todos los productos"
          color={colors.primary_text}
          checked={selectedOption === "default"}
          onChange={() => handleRadioChange("default")}
        />
      </div>
    </div>
  )
}

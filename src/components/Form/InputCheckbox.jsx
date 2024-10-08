import React from "react"
import { Checkbox } from "@mantine/core"
import { colors } from "../../theme/colors"

export default function InputCheckbox({ label, name, register }) {
  return (
    <div className="flex items-center">
      <Checkbox
        {...register(name)} // Usamos register directamente aquí
        classNames={{ input: "accent-sky-950 cursor-pointer " }}
        mt={"md"}
        labelPosition="left"
        label={<div className="text-sm font-bold leading-snug">¿Incluye bebida?</div>}
        color={colors.main_app_color}
      />
    </div>
  )
}

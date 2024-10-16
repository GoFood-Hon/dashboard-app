import React from "react"
import { Checkbox, Group } from "@mantine/core"
import { colors } from "../../theme/colors"

export default function InputCheckbox({ label, name, register }) {
  return (
    <Group className="flex items-center">
      <Checkbox
        {...register(name)}
        mt={"md"}
        labelPosition="left"
        label={label}
        color={colors.main_app_color}
      />
    </Group>
  )
}

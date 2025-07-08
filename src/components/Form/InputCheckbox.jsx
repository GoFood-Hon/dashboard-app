import React from "react"
import { Checkbox, Group, MantineProvider } from "@mantine/core"
import { colors } from "../../theme/colors"
import { theme } from "../../utils/constants"

export default function InputCheckbox({ label, name, register, labelPosition = "left" }) {
  return (
    <Group>
      <MantineProvider theme={theme}>
        <Checkbox {...register(name)} mt={"md"} labelPosition={labelPosition} label={label} color={colors.main_app_color} />
      </MantineProvider>
    </Group>
  )
}

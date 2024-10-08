import React from "react"
import { InputComboboxSelected } from "../../components/Form/InputComboboxSelected"
import { preparationTime } from "../../utils/constants"
import { Paper } from "@mantine/core"

export default function PreparationForm({ setValue, register }) {
  return (
    <Paper withBorder className="rounded-2xl p-6">
      <InputComboboxSelected
        items={preparationTime}
        setValue={setValue}
        register={register}
        label={"Preparación"}
        name={"preparationTime"}
      />
    </Paper>
  )
}

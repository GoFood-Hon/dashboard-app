import React from "react"
import { Grid, Group, Paper } from "@mantine/core"
import InputField from "../../components/Form/InputField"

export default function PaymentForm({ register, errors }) {
  return (
    <Group grow>
      <InputField
        label="Precio inicial"
        name="price"
        register={register}
        errors={errors}
        placeholder="Ejemplo: HNL 200.00"
        className="text-black"
      />
    </Group>
  )
}

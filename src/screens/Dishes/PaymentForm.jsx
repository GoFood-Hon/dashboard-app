import React from "react"
import { Grid, Paper } from "@mantine/core"
import InputField from "../../components/Form/InputField"

export default function PaymentForm({ register, errors }) {
  return (
    <Grid className="rounded-2xl p-4">
      <Paper withBorder radius='md' w='100%'>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField
            label="Precio inicial"
            name="price"
            register={register}
            errors={errors}
            placeholder="Ej. HND 200.00"
            className="text-black"
          />
        </Grid.Col>
      </Paper>
    </Grid>
  )
}

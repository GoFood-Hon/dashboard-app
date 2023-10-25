import React from "react"
import { Grid } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import { inputRequired } from "../../utils/inputRules"

export default function PaymentForm({ register, errors }) {
  return (
    <Grid className="bg-white rounded-2xl border border-blue-100 p-4">
      <div className="flex flex-row item-center w-full h-full flex-wrap">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField
            label="Precio inicial"
            name="initialPrice"
            register={register}
            rules={inputRequired}
            errors={errors}
            placeholder="Ej. HND 200.00"
            className="text-black"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField
            label="Precio final"
            name="finalPrice"
            register={register}
            rules={inputRequired}
            errors={errors}
            placeholder="Ej. HND 150.00"
            className="text-black"
          />
        </Grid.Col>
      </div>
    </Grid>
  )
}

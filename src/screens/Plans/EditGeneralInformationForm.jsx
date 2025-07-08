import React, { useEffect, useState } from "react"
import { Grid, Paper, Select } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_TYPE, taxesValues } from "../../utils/constants"
import { Controller } from "react-hook-form"

export const EditGeneralInformationForm = ({ register, errors, setValue, data, control }) => {
  const [paymentType, setPaymentType] = useState(DEFAULT_PAYMENT_TYPE)
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)

  useEffect(() => {
    if (data?.paymentType) {
      setPaymentType(data.paymentType)
    }
  }, [data?.paymentType])

  const onChangeCurrency = (value) => {
    setCurrency(value)
    setValue("currency", value)
  }

  const onChangePaymentType = (value) => {
    setPaymentType(value)
    setValue("paymentType", value)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
        <Paper withBorder radius="md" p="md">
          <div className="flex flex-col w-full">
            <Grid>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <InputField label="Nombre del plan" name="name" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputField label="Precio" name="price" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Controller
                  name="tax"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Impuesto (Obligatorio)"
                      data={taxesValues.map((item) => ({
                        value: item.value,
                        label: item.label
                      }))}
                      allowDeselect={false}
                      maxDropdownHeight={200}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Tipo de pago"
                  data={["MENSUAL", "ANUAL"]}
                  allowDeselect={false}
                  value={paymentType}
                  onChange={onChangePaymentType}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select label="Moneda" data={["HNL", "USD"]} allowDeselect={false} value={currency} onChange={onChangeCurrency} />
              </Grid.Col>
            </Grid>
          </div>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

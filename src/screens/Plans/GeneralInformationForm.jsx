import { useState } from "react"
import { Grid, Paper, Select } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import { Controller } from "react-hook-form"
import { taxesValues } from "../../utils/constants"

export const GeneralInformationForm = ({ register, errors, setValue, control }) => {
  const [paymentType, setPaymentType] = useState()
  const [currency, setCurrency] = useState()

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
                <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputField label="Precio (Obligatorio)" name="price" register={register} errors={errors} />
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
                  label="Tipo de pago (Obligatorio)"
                  data={["MENSUAL", "ANUAL"]}
                  allowDeselect={false}
                  value={paymentType}
                  onChange={onChangePaymentType}
                  error={errors.paymentType && errors.paymentType.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Moneda (Obligatorio)"
                  data={["HNL", "USD"]}
                  allowDeselect={false}
                  value={currency}
                  onChange={onChangeCurrency}
                  error={errors.currency && errors.currency.message}
                />
              </Grid.Col>
            </Grid>
          </div>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

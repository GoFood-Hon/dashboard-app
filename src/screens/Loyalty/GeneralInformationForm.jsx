import React, { useEffect } from "react"
import { Grid, Paper } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"

export const GeneralInformationForm = ({ register, errors, setValue, data }) => {

  useEffect(() => {
    if (data?.paymentType) {
      setPaymentType(data.paymentType)
    }
  }, [data?.paymentType])

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
        <Paper withBorder radius="md" className="w-full h-full items-center justify-center flex  rounded-2xl p-4">
          <div className="flex flex-col w-full">
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <InputField label="Nombre del programa (Obligatorio)" name="title" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <InputField
                  label="Cantidad de días desde la primer compra para reiniciar conteo (Obligatorio)"
                  name="amountOfDaysSinceFirstPurchaseToRestartCounting"
                  register={register}
                  errors={errors}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <InputField
                  label="Número máximo de compras permitidas (Obligatorio)"
                  name="maximumAmountOfPurchasesAllowed"
                  register={register}
                  errors={errors}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <InputField
                  label="Precio mínimo para activación (Obligatorio)"
                  name="minimumPurchasePriceForActivation"
                  register={register}
                  errors={errors}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12 }}>
                <InputTextAreaField label="Descripción" name="description" register={register} errors={errors} />
              </Grid.Col>
            </Grid>
          </div>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

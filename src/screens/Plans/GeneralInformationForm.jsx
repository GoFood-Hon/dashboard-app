import React, { useEffect, useState } from "react"
import { Grid, MultiSelect, Paper, Select } from "@mantine/core"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import plansApi from "../../api/plansApi"
import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_TYPE } from "../../utils/constants"

export const GeneralInformationForm = ({ register, errors, setValue, featuresList, setFeaturesList }) => {
  const [paymentType, setPaymentType] = useState()
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [dishesAdded, setDishesAdded] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await plansApi.getFeatures()

        setFeaturesList(response.data)

        if (response.status !== "success") {
          toast.error(`Fallo al obtener las características. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        }
      } catch (e) {
        toast.error(`Error. Por favor intente de nuevo. ${e.message}`, {
          duration: 7000
        })
      }
    })()
  }, [])

  const RenderInputs = () => {
    const inputs = featuresList.filter((feature) => dishesAdded.includes(feature.id))
    return (
      <>
        {inputs.map(
          (input) =>
            input.type === "amount" && (
              <Grid.Col key={input.id} span={{ base: 12, md: 6 }}>
                <InputField key={input.id} label={input.name} name={input.featureCode} register={register} errors={errors} />
              </Grid.Col>
            )
        )}
      </>
    )
  }

  const onChangeCurrency = (value) => {
    setCurrency(value)
    setValue("currency", currency)
  }

  const onChangePaymentType = (value) => {
    setPaymentType(value)
    setValue("paymentType", value)
  }

  const onChangeDishesAdded = (value) => {
    setValue("featureIds", value)
    setDishesAdded(value)
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
                <InputField label="Impuestos" name="tax" register={register} errors={errors} />
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
                <Select label="Moneda" data={["HNL"]} allowDeselect={false} value={currency} onChange={onChangeCurrency} />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <MultiSelect
                  label="Características disponibles"
                  value={dishesAdded}
                  onChange={onChangeDishesAdded}
                  data={[{ group: "Features", items: featuresList.map((item) => ({ value: item.id, label: item.name })) }]}
                />
              </Grid.Col>
              <RenderInputs />
            </Grid>
          </div>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

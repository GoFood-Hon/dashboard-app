import React, { useEffect, useState } from "react"
import { Grid, MultiSelect, Paper, Select } from "@mantine/core"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import plansApi from "../../api/plansApi"
import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_TYPE } from "../../utils/constants"

export const GeneralInformationForm = ({ register, errors, setValue, featuresList, setFeaturesList }) => {
  const [paymentType, setPaymentType] = useState(DEFAULT_PAYMENT_TYPE)
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
              <InputField
                key={input.id}
                label={input.name}
                name={input.featureCode}
                register={register}
                errors={errors}
                className="text-black"
              />
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
    setValue("paymentType", paymentType)
  }

  const onChangeDishesAdded = (value) => {
    setValue("featureIds", value)
    setDishesAdded(value)
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
        <Paper withBorder radius='md' p='md'>
          <div className="flex flex-col w-full">
            <Grid>
              <Grid.Col span={{ base: 12, md: 12 }}>
                <InputField label="Nombre del plan" name="name" register={register} errors={errors} className="text-black" />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputField label="Precio" name="price" register={register} errors={errors} className="text-black" />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputField label="Impuestos" name="tax" register={register} errors={errors} className="text-black" />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <label className="text-sm font-bold leading-snug">Tipo de pago</label>
                <div className="mt-1">
                  <Select
                    data={["Mensual", "Anual"]}
                    allowDeselect={false}
                    size="md"
                    value={paymentType}
                    onChange={onChangePaymentType}
                  />
                </div>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <span className="text-sm font-bold leading-snug">Moneda</span>
                <div className="mt-1">
                  <Select data={["HNL"]} allowDeselect={false} size="md" value={currency} onChange={onChangeCurrency} />
                </div>
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <span className="text-sm font-bold leading-snug">Características disponibles</span>
                <div className="mt-1">
                  <MultiSelect
                    placeholder="Seleccione las características"
                    value={dishesAdded}
                    onChange={onChangeDishesAdded}
                    size="md"
                    data={[{ group: "Features", items: featuresList.map((item) => ({ value: item.id, label: item.name })) }]}
                  />
                </div>
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <RenderInputs />
              </Grid.Col>
            </Grid>
          </div>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

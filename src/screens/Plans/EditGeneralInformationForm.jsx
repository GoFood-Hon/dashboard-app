import React, { useEffect, useState } from "react"
import { Grid, MultiSelect, Paper, Select } from "@mantine/core"
import toast from "react-hot-toast"
import InputField from "../../components/Form/InputField"
import plansApi from "../../api/plansApi"
import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_TYPE } from "../../utils/constants"
import { useParams } from "react-router-dom"

export const EditGeneralInformationForm = ({ register, errors, setValue, featuresList, setFeaturesList, data }) => {
  const { planId } = useParams()
  const [paymentType, setPaymentType] = useState(DEFAULT_PAYMENT_TYPE)
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY)
  const [dishesAdded, setDishesAdded] = useState([])
  const [planData, setPlanData] = useState([])

  // Actualiza el paymentType cuando cambien los datos
  useEffect(() => {
    if (data?.paymentType) {
      setPaymentType(data.paymentType)
    }
  }, [data?.paymentType])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await plansApi.getFeatures()
        const planResponse = await plansApi.getPlan(planId)
        setPlanData(planResponse.data.plan)
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
    const inputs = planData?.PlanFeatures?.filter((feature) => dishesAdded?.includes(feature.id))
    console.log(inputs)
    return (
      <>
        {inputs?.map(
          (input) =>
            input.type === "amount" && (
              <InputField
                key={input.id}
                label={input.name}
                name={input.featureCode}
                register={register}
                value={input.PlanPlanFeatures.quantity.toString()}
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
    setValue("paymentType", value)
  }

  const onChangeDishesAdded = (value) => {
    console.log(value)
    setValue("featureIds", value)
    setDishesAdded(value)
  }

  const defaultSelectedFeatures = data?.PlanFeatures?.map((feature) => feature.id)

  useEffect(() => {
    setDishesAdded(defaultSelectedFeatures)
  }, [data?.PlanFeatures])

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
        <Paper withBorder radius='md' className="w-full h-full items-center justify-center flex  rounded-2xl p-4">
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
                  <Select data={["MENSUAL", "ANUAL"]} size="md" value={paymentType} onChange={onChangePaymentType} />
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

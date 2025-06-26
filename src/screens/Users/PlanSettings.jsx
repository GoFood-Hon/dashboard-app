import React, { useEffect, useState } from "react"
import { Tabs, Card, Text, Group, Divider, Stack, Flex } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import Button from "../../components/Button"
import InputField from "../../components/Form/InputField"
import { useNavigate } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import plansApi from "../../api/plansApi"
import toast from "react-hot-toast"
import { colors } from "../../theme/colors"
import { IconCreditCard } from "@tabler/icons-react"
import classes from "./CreditCard.module.css"
import { PlanInfoCard } from "../../components/Plans/PlanInfoCard"
import { SelectPlan } from "./SelectPlan"
import BackButton from "../Dishes/components/BackButton"
import { CreditCard } from "../Plans/CreditCard"

export default function PlanSettings() {
  const user = useSelector((state) => state.user.value)
  const planData = user?.Restaurant?.Subscription?.Plan
  const navigate = useNavigate()
  const [creditCard, setCreditCard] = useState()
  const [planCancelled, setPlanCancelled] = useState(false)
  const [newPlan, setNewPlan] = useState({})

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handlePlanCancel = (cancelled) => {
    setPlanCancelled(cancelled)
  }

  const handleSelectNewPlan = (planId) => {
    setNewPlan(planId)
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("cardNumber", data.cardNumber)
      formData.append("expirationDate", data.expirationDate)
      formData.append("cvv", data.cvv)

      const response = await plansApi.addCard(formData)

      if (response.error) {
        toast.error(`Fallo al agregar el método de pago. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        navigate(SETTING_NAVIGATION_ROUTES.General.path)
        toast.success("Método agregado exitosamente", {
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      toast.error(`Error. Por favor intente de nuevo. ${error}`, {
        duration: 7000
      })
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response = await plansApi.getCard()
        if (response.status === "success") {
          setCreditCard(response.data)
        } else {
          toast.error("Hubo un problema obteniendo la información de la tarjeta", {
            duration: 7000
          })
        }
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    })()
  }, [])

  return (
    <Stack gap="xs">
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title="Plan" />
        </Flex>
      </Group>
      <Tabs defaultValue="payments" color={colors.main_app_color}>
        <Tabs.List>
          <Tabs.Tab value="payments">Plan activo</Tabs.Tab>
          <Tabs.Tab value="paymentMethod">Método de pago</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="payments" pt="sm">
          {planData && planData.name ? (
            <SettingsCard title="Plan actual" iconName="creditCard">
              <PlanDetailsCard plan={planData} />
            </SettingsCard>
          ) : (
            <SettingsCard title="Plan actual" iconName="creditCard">
              <p className="p-10 text-center font-semibold text-gray-400">Sin plan activo</p>
            </SettingsCard>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="paymentMethod" pt="sm">
          <Stack gap="sm">
            <SettingsCard title="Tarjeta actual" iconName="creditCard">
              {/* {creditCard ? (
                <div className="flex justify-center items-center">
                  <CreditCardInfo data={creditCard} />
                </div>
              ) : (
                <div className="flex flex-row justify-center items-center p-10 text-gray-400">Sin tarjeta disponible</div>
              )} */}
              {/* <CreditCard
                number="1234567812345678"
                holder="Victor Reyes"
                expires="12/26"
                brandLogo="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
              /> */}
            </SettingsCard>
            <SettingsCard title="Agregar tarjeta de crédito" iconName="creditCard">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full py-2">
                  <InputField label="Número de tarjeta" name="cardNumber" register={register} errors={errors} />
                </div>
                <div className="flex flex-col w-full py-2">
                  <InputField label="Fecha de expiración" name="expirationDate" register={register} errors={errors} />
                </div>
                <div className="flex flex-col w-full py-2">
                  <InputField label="CVV" name="cvv" register={register} errors={errors} />
                </div>
                <div className="w-full flex flex-row gap-2">
                  <Button
                    text={"Descartar"}
                    className={"text-xs border border-red-400 text-red-400 "}
                    onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}
                  />
                  <Button
                    text={"Guardar"}
                    className="flex h-10 items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
                  />
                </div>
              </form>
            </SettingsCard>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

const PlanDetailsCard = ({ plan }) => {
  const { name, price, tax, currency, paymentType, PlanFeatures } = plan

  return (
    <div className="border rounded-lg  p-4  m-4">
      <h1 className="text-lg font-semibold mb-2">{name}</h1>
      <p>
        <span className="font-semibold">Precio:</span> {currency} {price}{" "}
        {paymentType.toLowerCase() === "mensual" ? "mensuales" : "anuales"} (Tasa de interés: {tax}%)
      </p>
      <h2 className="text-md font-semibold mt-4 mb-2">Características:</h2>
      <ul className="list-disc pl-6">
        {PlanFeatures.map((feature) => (
          <li key={feature.id}>
            {feature.name}: {feature.PlanPlanFeatures.quan}{" "}
            {feature.type === "amount" ? "" : feature.PlanPlanFeatures.avai ? "Incluídas" : "No incluídas"}
          </li>
        ))}
      </ul>
    </div>
  )
}

const CreditCardInfo = ({ data }) => {
  const { brand, safeIdentifier, validThru } = data
  const expMonth = validThru?.substring(0, 2)
  const expYear = validThru?.substring(2)
  return (
    // <div className=" w-2/4 shadow-xl border-2 rounded-lg p-4 m-10">
    //   <div className="flex items-center justify-between mb-4">
    //     <h2 className="text-lg font-semibold">Tarjeta actual</h2>
    //     <span>
    //       <i className="fas fa-credit-card mr-1"></i>
    //       {brand}
    //     </span>
    //   </div>
    //   <div className="flex items-center justify-between mb-4">
    //     <div className="flex items-center">
    //       <i className="fas fa-lock mr-1 "></i>
    //       <span>{safeIdentifier}</span>
    //     </div>
    //     <div>
    //       {expMonth}/{expYear}
    //     </div>
    //   </div>
    // </div>
    <Card className={classes.card} radius="md" withBorder>
      {/* Ícono de fondo */}
      <IconCreditCard className={classes.iconBackground} />

      <Stack spacing="md" h="100%" justify="space-between">
        {/* Chip */}
        <div className={classes.chip}></div>

        {/* Número de la tarjeta */}
        <Text className={classes.cardNumber}>{"1458 8756 8441 7711" || "#### #### #### ####"}</Text>

        <Group position="apart" spacing="xs">
          {/* Nombre del titular */}
          <Stack spacing={0}>
            <Text size="xs" transform="uppercase">
              Titular
            </Text>
            <Text className={classes.cardDetails}>{"Victor Alfonso Reyes Gudiel" || "Nombre Apellido"}</Text>
          </Stack>

          {/* Fecha de expiración */}
          <Stack spacing={0}>
            <Text size="xs" transform="uppercase">
              Vence
            </Text>
            <Text className={classes.cardDetails}>{"11/27" || "MM/AA"}</Text>
          </Stack>
        </Group>
      </Stack>
    </Card>
  )
}

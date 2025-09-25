import React, { useEffect, useState } from "react"
import { Card, Text, Group, Stack, Flex, Paper, ThemeIcon, SimpleGrid, Grid, Button, Center, Image } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import InputField from "../../components/Form/InputField"
import { useNavigate } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import plansApi from "../../api/plansApi"
import { colors } from "../../theme/colors"
import { IconCreditCard } from "@tabler/icons-react"
import classes from "./CreditCard.module.css"
import BackButton from "../Dishes/components/BackButton"
import classesTwo from "./CardGradient.module.css"
import { getFormattedHNL, getFormattedUSD, toPercentage } from "../../utils"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { IconCircleXFilled } from "@tabler/icons-react"
import { IconCarambola } from "@tabler/icons-react"
import { cardLogos } from "../../utils/constants"
import { showNotification } from "@mantine/notifications"

export default function PlanSettings() {
  const user = useSelector((state) => state.user.value)
  const planData = user?.Restaurant?.Subscription?.Plan
  const navigate = useNavigate()
  const [creditCard, setCreditCard] = useState()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("cardNumber", data.cardNumber)
      formData.append("expirationDate", data.expirationDate)
      formData.append("cvv", data.cvv)

      const response = await plansApi.addCard(formData)

      if (response.error) {
        showNotification({
          title: "Fallo al agregar la tarjeta",
          message: response.message,
          color: "red",
          autoClose: 7000
        })
      } else {
        navigate(SETTING_NAVIGATION_ROUTES.General.path)
        showNotification({
          title: "Tarjeta agregada",
          message: "El método de pago ha sido agregado exitosamente",
          color: "green",
          autoClose: 7000
        })
      }
      return response.data
    } catch (error) {
      showNotification({
        title: "Fallo al agregar la tarjeta",
        message: `Por favor intente de nuevo`,
        color: "red",
        autoClose: 7000
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
          showNotification({
            title: "Fallo al obtener la información de la tarjeta",
            message: response.message,
            color: "red",
            autoClose: 7000
          })
        }
      } catch (error) {
        showNotification({
          title: "Fallo al obtener la información de la tarjeta",
          message: `Por favor intente de nuevo`,
          color: "red",
          autoClose: 7000
        })
      }
    })()
  }, [])

  return (
    <Stack gap="xs">
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title="Administración de plan y tarjeta" />
        </Flex>
      </Group>
      <Stack gap="sm">
        {planData && planData.name ? (
          <SettingsCard title="Plan actual" icon={IconCarambola}>
            <PlanDetailsCard plan={planData} />
          </SettingsCard>
        ) : (
          <SettingsCard title="Plan actual" icon={IconCarambola}>
            <Flex justify="center" align="center" h="100%" mih={150}>
              <Text ta="center" fw={600} c="dimmed" px="md">
                Este comercio no tiene un plan activo
              </Text>
            </Flex>
          </SettingsCard>
        )}
        <SettingsCard title="Información de la tarjeta" icon={IconCreditCard}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 1, md: 2 }}>
              {creditCard ? (
                <Center h="100%">
                  <CreditCardInfo data={creditCard} />
                </Center>
              ) : (
                <Center h="100%" p="xl">
                  <Text c="dimmed" fw={600}>
                    Sin tarjeta disponible
                  </Text>
                </Center>
              )}
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }} order={{ base: 2, md: 1 }}>
              <Paper withBorder radius="md" h="100%" p="md">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack>
                    <InputField label="Número de tarjeta (Obligatorio)" name="cardNumber" register={register} errors={errors} />
                    <InputField
                      label="Fecha de expiración (Obligatorio)"
                      name="expirationDate"
                      register={register}
                      errors={errors}
                    />
                    <InputField label="CVV (Obligatorio)" name="cvv" register={register} errors={errors} />

                    <Flex justify="end" gap="xs">
                      <Button color={colors.main_app_color} type="submit">
                        Actualizar tarjeta
                      </Button>
                    </Flex>
                  </Stack>
                </form>
              </Paper>
            </Grid.Col>
          </Grid>
        </SettingsCard>
      </Stack>
    </Stack>
  )
}

const PlanDetailsCard = ({ plan }) => {
  const { name, price, tax, currency, paymentType, PlanFeatures } = plan

  return (
    <Paper withBorder radius="md" className={classesTwo.card} w="100%">
      <Flex gap="xl" align="stretch" wrap="wrap" w="100%">
        <Flex direction="column" w={{ base: "100%", md: "30%" }} h="100%" justify="space-between">
          <Stack gap="sm">
            <Text size="xl" fw={700}>
              {name.toUpperCase()}
            </Text>
            <Text>
              Precio: {price !== "0.00" ? (currency === "USD" ? getFormattedUSD(price) : getFormattedHNL(price)) : "Gratuito"}{" "}
              {price !== "0.00" ? (paymentType.toLowerCase() === "mensual" ? "mensuales" : "anuales") : ""}
            </Text>
            <Text>Impuesto: {tax !== "0.00" ? toPercentage(tax) : "Ninguno"}</Text>
            <Text>Moneda: {currency}</Text>
          </Stack>
        </Flex>

        <Flex direction="column" w={{ base: "100%", md: "65%" }} h="100%">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm" verticalSpacing="xs">
            {PlanFeatures?.slice()
              .sort((a, b) => {
                if (a.type === "amount" && b.type === "boolean") return -1
                if (a.type === "boolean" && b.type === "amount") return 1
                return a.name.localeCompare(b.name)
              })
              .map((feature, index) => {
                const planData = feature.PlanPlanFeatures
                const isActive = planData?.avai || (planData?.quan ?? 0) > 0

                return (
                  <Flex key={index} align="center" gap="xs">
                    <ThemeIcon color={isActive ? "green" : "gray"} variant="transparent" radius="xl">
                      {isActive ? <IconCircleCheckFilled /> : <IconCircleXFilled color={colors.main_app_color} />}
                    </ThemeIcon>

                    <Flex gap={5}>
                      <Text fw={600} size="sm">
                        {feature.name}:
                      </Text>
                      {feature.type === "amount" && typeof planData?.quan === "number" ? (
                        <Text size="sm">{planData.quan}</Text>
                      ) : (
                        <Text size="sm">{planData?.avai ? "Habilitado" : "Deshabilitado"}</Text>
                      )}
                    </Flex>
                  </Flex>
                )
              })}
          </SimpleGrid>
        </Flex>
      </Flex>
    </Paper>
  )
}

const CreditCardInfo = ({ data }) => {
  const { brand, safeIdentifier, validThru } = data
  const expMonth = validThru?.substring(0, 2)
  const expYear = validThru?.substring(2)

  const logoSrc = cardLogos[brand?.toLowerCase()]

  return (
    <Card className={classes.card} radius="md" withBorder>
      <IconCreditCard className={classes.iconBackground} />

      <Stack spacing="md" h="100%" justify="space-between">
        {logoSrc ? (
          <div className={classes.chip}>
            <Image src={logoSrc} alt={brand} h={28} fit="contain" />
          </div>
        ) : (
          <div className={classes.chip}></div>
        )}

        <Text className={classes.cardNumber}>{safeIdentifier}</Text>

        <Flex justify="space-between" w="100%">
          <Stack spacing={0}>
            <Text size="xs" tt="uppercase" className="invisible">
              Titular
            </Text>
            <Text fw={700} className={classes.cardDetails}>
              {brand}
            </Text>
          </Stack>

          <Stack spacing={0} align="end">
            <Text size="xs" tt="uppercase">
              Vence
            </Text>
            <Text fw={700} className={classes.cardDetails}>
              {expMonth}/{expYear}
            </Text>
          </Stack>
        </Flex>
      </Stack>
    </Card>
  )
}

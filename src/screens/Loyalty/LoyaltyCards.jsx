import { Button, CloseButton, Flex, Grid, Group, Modal, Paper, Select, SimpleGrid, Stack, Text } from "@mantine/core"
import Lottie from "react-lottie"
import animationData from "../../assets/animation/CouponsAnimation.json"
import { IconCircleDashedPlus } from "@tabler/icons-react"
import { useDisclosure } from "@mantine/hooks"
import InputField from "../../components/Form/InputField"
import { Controller } from "react-hook-form"
import { loyaltyCardsDiscountType } from "../../utils/constants"
import InputCheckbox from "../../components/Form/InputCheckbox"
import { getFormattedHNL } from "../../utils"
import { IconStarFilled } from "@tabler/icons-react"
import { useState } from "react"
import { colors } from "../../theme/colors"
import ConfirmationModal from "../ConfirmationModal"
import { useSelector } from "react-redux"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { useDispatch } from "react-redux"
import { addCards, removeLoyaltyCard } from "../../store/features/loyaltySlice"
import { notifications } from "@mantine/notifications"
import LoyaltyCardView from "../../components/Loyalty/LoyaltyCardView"

const LoyaltyCards = ({ register, setValue, control, errors, watch }) => {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const [opened, { open, close }] = useDisclosure(false)
  const isRewardADiscountInPurchase = watch("isRewardADiscountInPurchase")
  const type = watch("type", "porcentaje")
  const [openedDelete, { close: closeDelete, open: openDelete }] = useDisclosure(false)
  const [index, setIndex] = useState(null)
  const { loyaltyCards, programs } = useSelector((state) => state.loyalty)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const handleReset = () => {
    setValue("purchasesWithWhichRewardBegins", "")
    setValue("cardDescription", "")
    setValue("isRewardADiscountInPurchase", false)
    setValue("type", "porcentaje")
    setValue("discountFixedAmount", "")
    setValue("discountPercentage", "")
    setValue("minPriceToRedeem", "")
  }

  const handleRemoveCard = (indexToRemove) => {
    dispatch(removeLoyaltyCard(indexToRemove))
  }

  const handleAddCard = () => {
    const validateCard = (card) => {
      const errors = []

      if (!card.purchasesWithWhichRewardBegins) {
        errors.push("El campo 'Compras para iniciar recompensa' es obligatorio")
      } else if (!isRewardADiscountInPurchase && !card.description) {
        errors.push("El campo 'Descripción' es obligatorio cuando la recompensa no es un descuento")
      } else {
        const duplicate = loyaltyCards.some(
          (existingCard) => existingCard.purchasesWithWhichRewardBegins == card.purchasesWithWhichRewardBegins
        )
        if (duplicate) {
          errors.push("No pueden haber dos tarjetas con el mismo número de compras para iniciar recompensa")
        }
      }

      if (isRewardADiscountInPurchase) {
        if (type === "porcentaje") {
          if (!card.discountPercentage || card.discountPercentage < 1 || card.discountPercentage > 100) {
            errors.push("El campo 'Porcentaje de descuento' es obligatorio y debe estar entre 1 y 100")
          }
          if (!card.minPriceToRedeem) {
            errors.push("El campo 'Precio mínimo para redimir' es obligatorio")
          }
        } else {
          if (!card.discountFixedAmount) {
            errors.push("El campo 'Monto fijo de descuento' es obligatorio")
          }
          if (
            card.discountFixedAmount &&
            card.minPriceToRedeem &&
            parseInt(card.discountFixedAmount) >= parseInt(card.minPriceToRedeem)
          ) {
            errors.push("El 'Monto fijo de descuento' debe ser menor que la 'Cantidad mínima de compra requerida'")
          }
        }
      }

      if (errors.length > 0) {
        errors.forEach((error) => {
          notifications.show({
            title: "Error de validación",
            message: error,
            color: "red"
          })
        })
        return false
      }

      return true
    }

    const newCard = isRewardADiscountInPurchase
      ? type === "porcentaje"
        ? {
            description: watch("cardDescription"),
            purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
            isRewardADiscountInPurchase: isRewardADiscountInPurchase,
            type,
            discountPercentage: watch("discountPercentage"),
            minPriceToRedeem: watch("minPriceToRedeem")
          }
        : {
            description: watch("cardDescription"),
            purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
            isRewardADiscountInPurchase: isRewardADiscountInPurchase,
            type,
            discountFixedAmount: watch("discountFixedAmount"),
            minPriceToRedeem: watch("minPriceToRedeem")
          }
      : {
          description: watch("cardDescription"),
          purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
          isRewardADiscountInPurchase: isRewardADiscountInPurchase
        }

    if (!validateCard(newCard)) {
      return
    }

    dispatch(addCards(newCard))
    handleReset()
    close()
    notifications.show({
      title: "Tarjeta añadida",
      message: `La tarjeta se añadió a la lista, presione '${programs && Object.keys(programs).length !== 0 ? "Actualizar" : "Guardar"}' para poder crearla`,
      color: "green"
    })
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {loyaltyCards?.map((card, index) => (
          <LoyaltyCardView
            key={index}
            user={user}
            openDelete={openDelete}
            setIndex={setIndex}
            options={defaultOptions}
            type={card?.type}
            purchasesWithWhichRewardBegins={card?.purchasesWithWhichRewardBegins}
            description={card?.description || card?.cardDescription}
            isRewardADiscountInPurchase={card?.isRewardADiscountInPurchase}
            discountFixedAmount={card?.discountFixedAmount}
            discountPercentage={card?.discountPercentage}
            minPriceToRedeem={card?.minPriceToRedeem}
            cardIndex={index}
          />
        ))}

        {user.role !== "superadmin" && (
          <Paper mih={190} withBorder p="md" radius="md" style={{ cursor: "pointer" }} onClick={open}>
            <Flex justify="center" align="center" h="100%" gap={5}>
              <IconCircleDashedPlus style={{ opacity: 0.5 }} size="2rem" />
              <Text c="dimmed">Añadir tarjeta</Text>
            </Flex>
          </Paper>
        )}
      </SimpleGrid>

      <Modal
        radius="md"
        opened={opened}
        onClose={() => {
          close()
          handleReset()
        }}
        title="Nueva tarjeta"
        centered>
        <Grid>
          <Grid.Col span={12}>
            <InputField
              type="number"
              label="Número de compras requeridas para el beneficio"
              name="purchasesWithWhichRewardBegins"
              register={register}
              errors={errors}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <InputTextAreaField
              label={`Descripción (${isRewardADiscountInPurchase ? "Opcional" : "Obligatorio"})`}
              name="cardDescription"
              register={register}
              errors={errors}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <InputCheckbox label="¿Esta recompensa es un descuento?" name="isRewardADiscountInPurchase" register={register} />
          </Grid.Col>
          {isRewardADiscountInPurchase && (
            <>
              <Grid.Col span={12}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Tipo de descuento"
                      data={loyaltyCardsDiscountType.map((item) => ({
                        value: item.value,
                        label: item.label
                      }))}
                      defaultValue="porcentaje"
                      allowDeselect={false}
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error ? fieldState.error.message : null}
                    />
                  )}
                />
              </Grid.Col>
              {type === "porcentaje" ? (
                <Grid.Col span={12}>
                  <InputField
                    type="number"
                    label="Porcentaje de descuento"
                    name="discountPercentage"
                    register={register}
                    errors={errors}
                  />
                </Grid.Col>
              ) : (
                <Grid.Col span={12}>
                  <InputField
                    type="number"
                    label="Monto de descuento"
                    name="discountFixedAmount"
                    register={register}
                    errors={errors}
                  />
                </Grid.Col>
              )}
              <Grid.Col span={12}>
                <InputField
                  type="number"
                  label="Cantidad mínima de compra requerida"
                  name="minPriceToRedeem"
                  register={register}
                  errors={errors}
                />
              </Grid.Col>
            </>
          )}
          <Grid.Col span={12}>
            <Flex justify="end" gap={5}>
              <Button color={colors.main_app_color} onClick={handleAddCard}>
                Añadir tarjeta
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </Modal>

      <ConfirmationModal
        opened={openedDelete}
        close={closeDelete}
        title={"¿Estás seguro que deseas eliminar?"}
        description={
          programs &&
          Object.keys(programs).length !== 0 &&
          "La tarjeta dejará de mostrarse pero no se eliminará hasta que se presione el botón de actualizar"
        }
        onConfirm={() => handleRemoveCard(index)}
      />
    </>
  )
}

export default LoyaltyCards

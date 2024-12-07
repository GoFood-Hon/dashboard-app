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

const LoyaltyCards = ({ register, setValue, control, errors, watch, reset }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [cardsCreated, setCardsCreated] = useState([])
  const isRewardADiscountInPurchase = watch("isRewardADiscountInPurchase")
  const type = watch("type", "porcentaje")
  const [isLoading, setIsLoading] = useState(false)
  const [openedDelete, { close: closeDelete, open: openDelete }] = useDisclosure(false)
  const [index, setIndex] = useState(null)

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
    setValue("minimumPurchasePriceToRedeem", "")
  }

  const handleRemoveCard = (indexToRemove) => {
    setCardsCreated((prevCards) => prevCards.filter((_, index) => index !== indexToRemove))
  }

  const handleAddCard = () => {
    setIsLoading(true)
    const isDiscount = watch("isRewardADiscountInPurchase")

    const newCard = isDiscount
      ? {
          description: watch("cardDescription"),
          purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
          isDiscount,
          type: watch("type"),
          discountValue: type === "porcentaje" ? watch("discountPercentage") : watch("discountFixedAmount"),
          minimumPurchase: watch("minimumPurchasePriceToRedeem")
        }
      : {
          description: watch("cardDescription"),
          purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
          isDiscount
        }

    setCardsCreated((prev) => [...prev, newCard])
    handleReset()
    close()
    setIsLoading(false)
  }

  const placeholdersCount = Math.max(3 - cardsCreated.length, 0)

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {cardsCreated.map((card, index) => (
          <Paper key={index} withBorder p="sm" radius="md" style={{ position: "relative", overflow: "hidden" }}>
            <CloseButton
              style={{ position: "absolute", right: 8, top: 8, zIndex: 12 }}
              onClick={() => {
                openDelete()
                setIndex(index)
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
                opacity: 0.5
              }}>
              <Lottie speed={0.4} options={defaultOptions} width="100%" height="100%" isClickToPauseDisabled={true} />
            </div>

            <div style={{ position: "relative", zIndex: 10 }}>
              <Group justify="apart" grow>
                <Stack gap="xs">
                  <Flex align="center" gap={4}>
                    <IconStarFilled color={colors.yellow_logo} size="1rem" />
                    <Text c={colors.yellow_logo} tt="uppercase" fw={700} fz="xs">
                      Tarjeta de{" "}
                      {card?.type === "fijo"
                        ? "descuento fijo"
                        : card?.type === "porcentaje"
                          ? "descuento porcentual"
                          : "beneficio"}
                    </Text>
                  </Flex>
                  <Text fw={700} fz="sm">
                    Descripción: {card?.description ? card?.description : "No se especificó"}
                  </Text>
                  {card?.isDiscount && (
                    <>
                      <Text fz="sm" fw={700}>
                        {card?.type === "fijo"
                          ? `Monto: ${getFormattedHNL(card?.discountValue)}`
                          : `Se aplicará un porcentaje del ${card?.discountValue}%`}
                      </Text>
                      <Text fw={700} fz="sm">
                        La cantidad mínima de compra para gozar de este beneficio es de {getFormattedHNL(card?.minimumPurchase)}
                      </Text>
                    </>
                  )}
                </Stack>
              </Group>
            </div>
          </Paper>
        ))}

        {Array.from({ length: placeholdersCount }).map((_, index) => (
          <Paper
            key={`placeholder-${index}`}
            mih={180}
            withBorder
            p="md"
            radius="md"
            style={{ cursor: "pointer" }}
            onClick={open}>
            <Flex justify="center" align="center" h="100%" gap={5}>
              <IconCircleDashedPlus style={{ opacity: 0.5 }} size="2rem" />
              <Text c="dimmed">Añadir tarjeta</Text>
            </Flex>
          </Paper>
        ))}
      </SimpleGrid>

      <Modal radius='md' opened={opened} onClose={close} title="Nueva tarjeta" centered>
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
            <InputField label="Descripción" name="cardDescription" register={register} errors={errors} />
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
                  name="minimumPurchasePriceToRedeem"
                  register={register}
                  errors={errors}
                />
              </Grid.Col>
            </>
          )}
          <Grid.Col span={12}>
            <Flex justify="end" gap={5}>
              <Button loading={isLoading} color={colors.main_app_color} onClick={handleAddCard}>
                Añadir tarjeta
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>
      </Modal>

      <ConfirmationModal
        opened={openedDelete}
        close={closeDelete}
        title="¿Estás seguro que deseas eliminar?"
        description="La tarjeta dejará de mostrarse pero no se eliminará hasta que se presione el botón de actualizar"
        onConfirm={() => handleRemoveCard(index)}
      />
    </>
  )
}

export default LoyaltyCards

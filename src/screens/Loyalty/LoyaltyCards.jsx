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

const LoyaltyCards = ({ register, setValue, control, errors, watch, loyaltyCardsData }) => {
  const user = useSelector((state) => state.user.value)
  const dispatch = useDispatch()
  const [opened, { open, close }] = useDisclosure(false)
  const isRewardADiscountInPurchase = watch("isRewardADiscountInPurchase")
  const type = watch("type", "porcentaje")
  const [openedDelete, { close: closeDelete, open: openDelete }] = useDisclosure(false)
  const [index, setIndex] = useState(null)
  const { loyaltyCards } = useSelector((state) => state.loyalty)

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
    dispatch(removeLoyaltyCard(indexToRemove))
  }

  const handleAddCard = () => {
    const isDiscount = watch("isRewardADiscountInPurchase")

    const newCard = isDiscount
      ? type === "porcentaje"
        ? {
            description: watch("cardDescription"),
            purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
            isRewardADiscountInPurchase: isDiscount,
            type,
            discountPercentage: watch("discountPercentage"),
            minPriceToRedeem: watch("minPriceToRedeem")
          }
        : {
            description: watch("cardDescription"),
            purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
            isRewardADiscountInPurchase: isDiscount,
            type,
            discountFixedAmount: watch("discountFixedAmount"),
            minPriceToRedeem: watch("minPriceToRedeem")
          }
      : {
          description: watch("cardDescription"),
          purchasesWithWhichRewardBegins: watch("purchasesWithWhichRewardBegins"),
          isRewardADiscountInPurchase: isDiscount
        }

    dispatch(addCards(newCard))
    close()
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {loyaltyCards?.map((card, index) => (
          <Paper mih={190} key={index} p="sm" radius="md" style={{ position: "relative", overflow: "hidden" }}>
            <CloseButton
              style={{ position: "absolute", right: 8, top: 8, zIndex: 12, display: user?.role === 'superadmin' ? 'none' : 'block' }}
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
              <Lottie options={defaultOptions} width="100%" height="100%" isClickToPauseDisabled={true} />
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
                    Activación:{" "}
                    <Text span fs="italic" fz="sm">
                      A partir de{" "}
                      {card?.purchasesWithWhichRewardBegins != "1"
                        ? card?.purchasesWithWhichRewardBegins + " compras"
                        : card?.purchasesWithWhichRewardBegins + " compra"}
                    </Text>
                  </Text>
                  <Text fw={700} fz="sm">
                    Descripción:{" "}
                    <Text span fs="italic" fz="sm">
                      {card?.description || card?.cardDescription
                        ? card?.description || card?.cardDescription
                        : "No se especificó"}
                    </Text>
                  </Text>
                  {card?.isRewardADiscountInPurchase && (
                    <>
                      <Text fz="sm" fw={700}>
                        {card?.type === "fijo" ? (
                          <>
                            Monto de descuento:{" "}
                            <Text span fs="italic" fz="sm">
                              {getFormattedHNL(card?.discountFixedAmount)}
                            </Text>
                          </>
                        ) : (
                          <>
                            Porcentaje de descuento:{" "}
                            <Text span fs="italic" fz="sm">
                              {card?.discountPercentage}%
                            </Text>
                          </>
                        )}
                      </Text>
                      <Text fw={700} fz="sm">
                        Compra mínima:{" "}
                        <Text span fs="italic" fz="sm">
                          {getFormattedHNL(card?.minPriceToRedeem)}
                        </Text>
                      </Text>
                    </>
                  )}
                </Stack>
              </Group>
            </div>
          </Paper>
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
        title="¿Estás seguro que deseas eliminar?"
        description="La tarjeta dejará de mostrarse pero no se eliminará hasta que se presione el botón de actualizar"
        onConfirm={() => handleRemoveCard(index)}
      />
    </>
  )
}

export default LoyaltyCards

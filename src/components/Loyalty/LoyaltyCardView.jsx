import { Checkbox, CloseButton, Flex, Group, MantineProvider, Paper, Stack, Text, Tooltip } from "@mantine/core"
import { IconStarFilled } from "@tabler/icons-react"
import Lottie from "react-lottie"
import { colors } from "../../theme/colors"
import { getFormattedHNL } from "../../utils"
import { theme } from "../../utils/constants"
import { useDisclosure } from "@mantine/hooks"
import ConfirmationModal from "../../screens/ConfirmationModal"
import { useDispatch } from "react-redux"
import { markCardAsRedeemed } from "../../store/features/loyaltySlice"

const LoyaltyCardView = ({
  id,
  key,
  user,
  options,
  type,
  purchasesWithWhichRewardBegins,
  description,
  isRewardADiscountInPurchase,
  discountFixedAmount,
  discountPercentage,
  minPriceToRedeem,
  openDelete,
  setIndex,
  cardIndex,
  tracking,
  checked
}) => {
  const [opened, { close, open }] = useDisclosure(false)
  const dispatch = useDispatch()

  return (
    <>
      <Paper mih={190} w='100%' key={key} p="sm" radius="md" style={{ position: "relative", overflow: "hidden" }}>
        {tracking && !isRewardADiscountInPurchase && (
          <MantineProvider theme={theme}>
            <Tooltip
              label={checked ? "Tarjeta reclamada" : "Marcar como reclamada"}
              position="top"
              color={colors.main_app_color}
              withArrow>
              <Checkbox
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  zIndex: 12
                }}
                value={checked}
                checked={checked}
                color={colors.main_app_color}
                onClick={() => !checked && open()}
              />
            </Tooltip>
          </MantineProvider>
        )}
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
          <Lottie options={options} width="100%" height="100%" isClickToPauseDisabled={true} />
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          <Group justify="apart" grow w='100%'>
            <Stack gap="xs">
              <Flex align='center' justify='space-between'>
                <Flex align="center" gap={4}>
                  <IconStarFilled color={colors.yellow_logo} size="1rem" />
                  <Text c={colors.yellow_logo} tt="uppercase" fw={700} fz="xs">
                    Tarjeta de {type === "fijo" ? "descuento fijo" : type === "porcentaje" ? "descuento porcentual" : "beneficio"}
                  </Text>
                  {!tracking && (
                    <CloseButton
                      onClick={() => {
                        openDelete()
                        setIndex(cardIndex)
                      }}
                    />
                  )}
                </Flex>
              </Flex>
              <Text fw={700} fz="sm">
                Activación:{" "}
                <Text span fs="italic" fz="sm">
                  A partir de{" "}
                  {purchasesWithWhichRewardBegins != "1"
                    ? purchasesWithWhichRewardBegins + " compras"
                    : purchasesWithWhichRewardBegins + " compra"}
                </Text>
              </Text>
              <Text fw={700} fz="sm">
                Descripción:{" "}
                <Text span fs="italic" fz="sm">
                  {description ? description : "No se especificó"}
                </Text>
              </Text>
              {isRewardADiscountInPurchase && (
                <>
                  <Text fz="sm" fw={700}>
                    {type === "fijo" ? (
                      <>
                        Monto de descuento:{" "}
                        <Text span fs="italic" fz="sm">
                          {getFormattedHNL(discountFixedAmount)}
                        </Text>
                      </>
                    ) : (
                      <>
                        Porcentaje de descuento:{" "}
                        <Text span fs="italic" fz="sm">
                          {discountPercentage}%
                        </Text>
                      </>
                    )}
                  </Text>
                  <Text fw={700} fz="sm">
                    Compra mínima:{" "}
                    <Text span fs="italic" fz="sm">
                      {getFormattedHNL(minPriceToRedeem)}
                    </Text>
                  </Text>
                </>
              )}
            </Stack>
          </Group>
        </div>
      </Paper>

      <ConfirmationModal
        opened={opened}
        close={close}
        title="¿Estás seguro que deseas marcar como reclamada?"
        description="Una vez realizada esta acción, no se podrá deshacer."
        onConfirm={() => dispatch(markCardAsRedeemed(id))}
      />
    </>
  )
}

export default LoyaltyCardView

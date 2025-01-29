import BackButton from "../Dishes/components/BackButton"
import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  Grid,
  Group,
  Input,
  Loader,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core"
import { colors } from "../../theme/colors"
import { useSelector } from "react-redux"
import { IconAt, IconPhoneCall, IconMapPin, IconExclamationCircleFilled, IconCircleCheckFilled } from "@tabler/icons-react"
import LoyaltyCardView from "../../components/Loyalty/LoyaltyCardView"
import animationData from "../../assets/animation/CouponsAnimation.json"
import { useDispatch } from "react-redux"
import { getUserLoyaltyCards, setFilterValue, setClientIdentity, setCardCode } from "../../store/features/loyaltySlice"
import { useEffect } from "react"

const RewardsTracking = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const { clientIdentity, cardCode, userRewardData, loadingUserData, loadingUserCards, filterValue } = useSelector(
    (state) => state.loyalty
  )
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const handleGetLoyaltyCards = () => {
    dispatch(
      getUserLoyaltyCards({
        identityNumber: clientIdentity,
        restaurantId: user.restaurantId,
        ...(cardCode && { loyaltyCardCode: cardCode }),
        ...(filterValue !== "Todas" ? { isRedeemed: filterValue === "Reclamadas" } : {})
      })
    )
  }

  useEffect(() => {
    handleGetLoyaltyCards()
  }, [filterValue])

  return (
    <Stack gap="sm">
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title="Seguimiento de recompensas" />
        </Flex>
      </Group>

      <Grid>
        <Grid.Col span={12}>
          <Flex align="center" gap={5} style={{ width: "100%" }}>
            <Input
              placeholder="Ingresa el número de identidad (Requerido)"
              type="number"
              value={clientIdentity}
              onChange={(event) => {
                const value = event.currentTarget.value
                if (value.length <= 13) {
                  dispatch(setClientIdentity(value))
                }
              }}
              style={{ flex: 1 }}
              classNames={{
                input: "focus:border-gray-600"
              }}
            />
            <Input
              placeholder="Ingresa el código de la tarjeta (Opcional)"
              value={cardCode}
              onChange={(event) => dispatch(setCardCode(event.currentTarget.value))}
              rightSectionPointerEvents="all"
              style={{ flex: 1 }}
              maxLength={6}
              minLength={6}
              classNames={{
                input: "focus:border-gray-600"
              }}
            />
            <Button
              onClick={handleGetLoyaltyCards}
              color={colors.main_app_color}
              disabled={clientIdentity && clientIdentity.length >= 13 ? false : true}>
              Buscar
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>

      {/* User data */}
      {loadingUserData ? (
        <Box className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
          <Loader color={colors.main_app_color} />
        </Box>
      ) : userRewardData?.user ? (
        <>
          <Paper radius="md" withBorder p="xs">
            <Flex align="center" justify="space-between">
              <Flex gap={10} align="center">
                <Avatar
                  src={
                    userRewardData?.user?.photo ||
                    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                  }
                  size={80}
                  radius="md"
                />
                <Flex direction="column">
                  <Text fz="lg" fw={500}>
                    {userRewardData?.user?.name}
                  </Text>

                  <Group wrap="nowrap" gap={10} mt={3}>
                    <IconAt stroke={1.5} size={18} />
                    <Text fz="sm" c="dimmed">
                      {userRewardData?.user?.email}
                    </Text>
                  </Group>

                  <Group wrap="nowrap" gap={10} mt={5}>
                    <IconPhoneCall stroke={1.5} size={18} />
                    <Text fz="sm" c="dimmed">
                      {userRewardData?.user?.phoneNumber}
                    </Text>
                  </Group>

                  <Group wrap="nowrap" gap={10} mt={5}>
                    <IconMapPin stroke={1.5} size={18} />
                    <Text fz="sm" c="dimmed">
                      {userRewardData?.user?.UserAddresses[0]?.address ?? "Sin dirección"}
                    </Text>
                  </Group>
                </Flex>
              </Flex>
              <Flex align="center" gap={4}>
                {userRewardData?.user?.isVerified ? (
                  <IconCircleCheckFilled size={24} />
                ) : (
                  <IconExclamationCircleFilled size={30} />
                )}
                <Text c="dimmed">{userRewardData?.user?.isVerified ? "Cliente verificado" : "Cliente no verificado"}</Text>
              </Flex>
            </Flex>
          </Paper>

          {/* Loyalty cards */}
          {userRewardData?.loyaltyCards ? (
            <>
              <Flex align="center" justify="space-between">
                <Title order={4} tt="uppercase">
                  Listado de tarjetas
                </Title>
                {!cardCode && (
                  <SegmentedControl
                    value={filterValue}
                    withItemsBorders={false}
                    fullWidth
                    onChange={(value) => {
                      dispatch(setFilterValue(value))
                    }}
                    color={colors.main_app_color}
                    radius="md"
                    data={["Todas", "Reclamadas", "No reclamadas"]}
                  />
                )}
              </Flex>
              {loadingUserCards ? (
                <Box className="h-[calc(100vh-390px)] w-full flex justify-center items-center">
                  <Loader color={colors.main_app_color} />
                </Box>
              ) : userRewardData?.loyaltyCards?.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                  {userRewardData.loyaltyCards.map((card, index) => (
                    <LoyaltyCardView
                      key={index}
                      user={user}
                      options={defaultOptions}
                      type={card?.LoyaltyCard?.LoyaltyRedeemableCardReward?.type}
                      purchasesWithWhichRewardBegins={card?.LoyaltyCard?.purchasesWithWhichRewardBegins}
                      description={card?.LoyaltyCard?.description}
                      isRewardADiscountInPurchase={card?.LoyaltyCard?.isRewardADiscountInPurchase}
                      discountFixedAmount={card?.LoyaltyCard?.LoyaltyRedeemableCardReward?.discountFixedAmount}
                      discountPercentage={card?.LoyaltyCard?.LoyaltyRedeemableCardReward?.discountPercentage}
                      minPriceToRedeem={card?.LoyaltyCard?.LoyaltyRedeemableCardReward?.minPriceToRedeem}
                      cardIndex={index}
                      tracking
                      checked={card?.isRedeemed}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box className="h-[calc(100vh-390px)] w-full flex justify-center items-center">
                  <Text c="dimmed">
                    {filterValue === "Todas"
                      ? "Este cliente aún no tiene tarjetas"
                      : filterValue === "Reclamadas"
                        ? "No se encontraron tarjetas reclamadas"
                        : "No se encontraron tarjetas no reclamadas"}
                  </Text>
                </Box>
              )}
            </>
          ) : (
            <Box className="h-[calc(100vh-340px)] w-full flex justify-center items-center">
              <Text c="dimmed">Las tarjetas del cliente aparecerán aquí</Text>
            </Box>
          )}
        </>
      ) : (
        <Box className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
          <Text c="dimmed">
            {userRewardData?.user?.identityNumber ? "No se encontró ningún cliente" : "La información del cliente aparecerá aquí"}
          </Text>
        </Box>
      )}
    </Stack>
  )
}

export default RewardsTracking

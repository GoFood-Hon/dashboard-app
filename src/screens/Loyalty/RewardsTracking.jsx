import BackButton from "../Dishes/components/BackButton"
import {
  Box,
  Button,
  CloseButton,
  Flex,
  Grid,
  Group,
  Input,
  Loader,
  Pagination,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title
} from "@mantine/core"
import { colors } from "../../theme/colors"
import { useSelector } from "react-redux"
import LoyaltyCardView from "../../components/Loyalty/LoyaltyCardView"
import animationData from "../../assets/animation/CouponsAnimation.json"
import { useDispatch } from "react-redux"
import {
  getUserLoyaltyCards,
  setFilterValue,
  setClientIdentity,
  setCardCode,
  setCurrentRewardPage
} from "../../store/features/loyaltySlice"
import UserInfoLoyalty from "../../components/UserInfoLoyalty/UserInfoLoyalty"
import { NoPermissionsAnimation } from "../../components/Plans/NoPermissionsAnimation"

const RewardsTracking = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const {
    clientIdentity,
    cardCode,
    userRewardData,
    loadingUserData,
    loadingUserCards,
    filterValue,
    userRewardsPerPage,
    itemsRewardsPerPage,
    totalRewards,
    totalRewardsPageCount,
    currentRewardPage
  } = useSelector((state) => state.loyalty)
  const rewardCardsList = userRewardsPerPage[currentRewardPage] || []
  const haveLoyaltyProgramModule = !!user?.Restaurant?.Subscription?.Plan?.PlanFeatures?.some(
    (feature) => feature.featureCode === "loyalty-module" && feature.PlanPlanFeatures?.avai === true
  )

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const handleGetLoyaltyCards = (filter, page = 1, code = cardCode) => {
    dispatch(
      getUserLoyaltyCards({
        restaurantId: user.restaurantId,
        page,
        limit: itemsRewardsPerPage,
        identityNumber: clientIdentity,
        ...(code && { loyaltyCardCode: code }),
        ...(filter !== "Todas" ? { isRedeemed: filter === "Reclamadas" } : {})
      })
    )
  }

  return haveLoyaltyProgramModule ? (
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
              value={clientIdentity}
              onChange={(event) => dispatch(setClientIdentity(event.currentTarget.value))}
              rightSectionPointerEvents="all"
              style={{ flex: 1 }}
              maxLength={13}
              minLength={13}
              classNames={{
                input: "focus:border-gray-600"
              }}
              rightSection={
                <CloseButton
                  onClick={() => dispatch(setClientIdentity(""))}
                  style={{ display: clientIdentity ? undefined : "none" }}
                />
              }
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
              rightSection={
                <CloseButton
                  onClick={() => {
                    dispatch(setCardCode(""))
                    handleGetLoyaltyCards("Todas", 1, null)
                    dispatch(setFilterValue("Todas"))
                  }}
                  style={{ display: cardCode ? undefined : "none" }}
                />
              }
            />
            <Button
              onClick={() => handleGetLoyaltyCards("Todas")}
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
      ) : userRewardData.length !== 0 ? (
        <>
          <UserInfoLoyalty
            photo={userRewardData?.photo}
            name={userRewardData?.name}
            email={userRewardData?.email}
            phone={userRewardData?.phoneNumber}
            address={userRewardData?.UserAddresses[0]?.address}
            isVerified={userRewardData?.isVerified}
          />

          {/* Loyalty cards */}
          {rewardCardsList ? (
            <>
              <Flex align="center" justify="space-between">
                <Title order={4} tt="uppercase">
                  Listado de tarjetas
                </Title>
                <SegmentedControl
                  value={filterValue}
                  withItemsBorders={false}
                  disabled={cardCode}
                  fullWidth
                  onChange={(value) => {
                    handleGetLoyaltyCards(value)
                    dispatch(setFilterValue(value))
                  }}
                  color={colors.main_app_color}
                  radius="md"
                  data={["Todas", "Reclamadas", "No reclamadas"]}
                />
              </Flex>
              {loadingUserCards ? (
                <Box className="h-[calc(100vh-390px)] w-full flex justify-center items-center">
                  <Loader color={colors.main_app_color} />
                </Box>
              ) : rewardCardsList?.length > 0 ? (
                <SimpleGrid spacing="sm" cols={{ base: 1, sm: 2, lg: 3 }}>
                  {rewardCardsList?.map((card, index) => (
                    <LoyaltyCardView
                      id={card.id}
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
              {totalRewardsPageCount > 10 && (
                <Flex align="center" justify="end">
                  <Group>
                    <Pagination
                      total={totalRewardsPageCount}
                      page={currentRewardPage}
                      onChange={(page) => {
                        handleGetLoyaltyCards(filterValue, page)
                        dispatch(setCurrentRewardPage(page))
                      }}
                      color={colors.main_app_color}
                      defaultValue={currentRewardPage}
                      size="md"
                      withEdges
                    />
                  </Group>
                </Flex>
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
            {userRewardData?.identityNumber ? "No se encontró ningún cliente" : "La información del cliente aparecerá aquí"}
          </Text>
        </Box>
      )}
    </Stack>
  ) : (
    <NoPermissionsAnimation moduleName="lealtad" />
  )
}

export default RewardsTracking

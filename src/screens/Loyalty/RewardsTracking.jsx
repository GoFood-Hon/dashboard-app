import { useState } from "react"
import BackButton from "../Dishes/components/BackButton"
import {
  Avatar,
  Box,
  Button,
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
import loyaltyApi from "../../api/loyaltyApi"
import { useSelector } from "react-redux"
import {
  IconSearch,
  IconAt,
  IconPhoneCall,
  IconMapPin,
  IconExclamationCircleFilled,
  IconCircleCheckFilled
} from "@tabler/icons-react"
import LoyaltyCardView from "../../components/Loyalty/LoyaltyCardView"
import animationData from "../../assets/animation/CouponsAnimation.json"

const RewardsTracking = () => {
  const user = useSelector((state) => state.user.value)
  const [identityNumber, setIdentityNumber] = useState("")
  const [loyaltyCardCode, setLoyaltyCardCode] = useState("")
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const params = {
    identityNumber,
    restaurantId: user?.Restaurant?.id,
    loyaltyCardCode
  }
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  const LoyaltyCards = [
    {
      id: "8dbf6fde-d276-45db-8de4-085ac9b0cf84",
      loyaltyProgramId: "52071f1d-5964-416f-93c4-b5a078ec6f41",
      purchasesWithWhichRewardBegins: 3,
      isRewardADiscountInPurchase: true,
      createdAt: "2024-12-11T22:41:32.528Z",
      updatedAt: "2024-12-11T22:41:32.528Z",
      cardDescription: "",
      code: "PTR2Fo",
      type: "porcentaje",
      minPriceToRedeem: 450,
      discountFixedAmount: null,
      discountPercentage: 12
    },
    {
      id: "18af455e-d1d9-42ba-9d84-3fc687d2319e",
      loyaltyProgramId: "52071f1d-5964-416f-93c4-b5a078ec6f41",
      purchasesWithWhichRewardBegins: 5,
      isRewardADiscountInPurchase: true,
      createdAt: "2024-12-12T00:13:28.953Z",
      updatedAt: "2024-12-12T00:13:28.953Z",
      cardDescription: "",
      code: "spdeTC",
      type: "porcentaje",
      minPriceToRedeem: 500,
      discountFixedAmount: null,
      discountPercentage: 12
    },
    {
      id: "ddb8cb97-caf1-4d58-ba8a-5293fc5a40f6",
      loyaltyProgramId: "52071f1d-5964-416f-93c4-b5a078ec6f41",
      purchasesWithWhichRewardBegins: 4,
      isRewardADiscountInPurchase: true,
      createdAt: "2024-12-12T21:50:11.434Z",
      updatedAt: "2024-12-12T21:50:11.434Z",
      cardDescription: "",
      code: "d%FHIZ",
      type: "fijo",
      minPriceToRedeem: 450,
      discountFixedAmount: 90,
      discountPercentage: null
    },
    {
      id: "bff87889-647a-4582-bdae-a404e3e1af92",
      loyaltyProgramId: "52071f1d-5964-416f-93c4-b5a078ec6f41",
      purchasesWithWhichRewardBegins: 10,
      isRewardADiscountInPurchase: false,
      isRedeemed: false,
      createdAt: "2024-12-14T20:22:26.542Z",
      updatedAt: "2024-12-14T20:22:26.542Z",
      cardDescription: "Cena para 2 personas",
      code: "ZIxCLW"
    }
  ]

  const handleSearch = async () => {
    setIsLoading(true)
    const response = await loyaltyApi.getUserLoyaltyCards(params)
    console.log(response.data)
    setUserData(response.data)
    setIsLoading(false)
  }

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
              value={identityNumber}
              onChange={(event) => {
                const value = event.currentTarget.value
                if (value.length <= 13) {
                  setIdentityNumber(value)
                }
              }}
              rightSectionPointerEvents="all"
              style={{ flex: 1 }}
              classNames={{
                input: "focus:border-gray-600"
              }}
            />
            <Input
              placeholder="Ingresa el código de la tarjeta (Opcional)"
              value={loyaltyCardCode}
              onChange={(event) => setLoyaltyCardCode(event.currentTarget.value)}
              rightSectionPointerEvents="all"
              style={{ flex: 1 }}
              maxLength={6}
              minLength={6}
              classNames={{
                input: "focus:border-gray-600"
              }}
            />
            <Button
              onClick={handleSearch}
              color={colors.main_app_color}
              disabled={identityNumber && identityNumber.length >= 13 ? false : true}
              leftSection={<IconSearch size={20} stroke={1.5} />}>
              Buscar
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>

      {/* User data */}
      {isLoading ? (
        <Box className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
          <Loader color={colors.main_app_color} />
        </Box>
      ) : userData?.user ? (
        <>
          <Paper radius="md" withBorder p="xs">
            <Flex align="center" justify="space-between">
              <Flex gap={10} align="center">
                <Avatar
                  src={
                    userData?.user?.photo ||
                    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"
                  }
                  size={80}
                  radius="md"
                />
                <Flex direction="column">
                  <Text fz="lg" fw={500}>
                    {userData?.user?.name}
                  </Text>

                  <Group wrap="nowrap" gap={10} mt={3}>
                    <IconAt stroke={1.5} size={18} />
                    <Text fz="sm" c="dimmed">
                      {userData?.user?.email}
                    </Text>
                  </Group>

                  <Group wrap="nowrap" gap={10} mt={5}>
                    <IconPhoneCall stroke={1.5} size={18} />
                    <Text fz="sm" c="dimmed">
                      {userData?.user?.phoneNumber}
                    </Text>
                  </Group>

                  <Group wrap="nowrap" gap={10} mt={5}>
                    <IconMapPin stroke={1.5} size={18} />
                    <Text fz="sm" c="dimmed">
                      {userData?.user?.address ? userData?.user?.address : "Sin dirección"}
                    </Text>
                  </Group>
                </Flex>
              </Flex>
              <Flex align="center" gap={4}>
                {userData?.user?.isVerified ? <IconCircleCheckFilled size={24} /> : <IconExclamationCircleFilled size={30} />}
                <Text c="dimmed">{userData?.user?.isVerified ? "Cliente verificado" : "Cliente no verificado"}</Text>
              </Flex>
            </Flex>
          </Paper>

          {/* Loyalty cards */}
          {userData?.LoyaltyCards && userData?.LoyaltyCards.length !== 0 ? (
            <>
              <Flex align="center" justify="space-between">
                <Title order={4} tt="uppercase">
                  Listado de tarjetas
                </Title>
                {/* <SegmentedControl
                  value="Todas"
                  withItemsBorders={false}
                  fullWidth
                  color={colors.main_app_color}
                  radius="md"
                  data={["Todas", "Reclamadas", "No reclamadas"]}
                /> */}
              </Flex>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                {LoyaltyCards?.map((card, index) => (
                  <LoyaltyCardView
                    key={index}
                    user={user}
                    options={defaultOptions}
                    type={card?.type}
                    purchasesWithWhichRewardBegins={card?.purchasesWithWhichRewardBegins}
                    description={card?.description || card?.cardDescription}
                    isRewardADiscountInPurchase={card?.isRewardADiscountInPurchase}
                    discountFixedAmount={card?.discountFixedAmount}
                    discountPercentage={card?.discountPercentage}
                    minPriceToRedeem={card?.minPriceToRedeem}
                    cardIndex={index}
                    tracking
                    checked={card?.isRedeemed}
                  />
                ))}
              </SimpleGrid>
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
            {userData?.user?.identityNumber ? "No se encontró ningún cliente" : "La información del cliente aparecerá aquí"}
          </Text>
        </Box>
      )}
    </Stack>
  )
}

export default RewardsTracking

import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  Pagination,
  Stack,
  Text,
  Tooltip,
  Switch,
  Card,
  MantineProvider,
  createTheme,
  rem
} from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import BackButton from "./Dishes/components/BackButton"
import { colors } from "../theme/colors"
import { getFormattedHNL } from "../utils"
import Lottie from "react-lottie"
import animationData from "../assets/animation/NothingFoundAnimation.json"
import { APP_ROLES } from "../utils/constants"

const CardsViewLayout = ({
  title,
  page,
  limit,
  totalPageCount,
  totalElements,
  elementsName,
  loadingElements,
  elementsList,
  onNewItemClick,
  onEnableItem,
  onDisableItem,
  onDetailsClick,
  onPaginationChange,
  user
}) => {
  const theme = createTheme({
    cursorType: "pointer"
  })
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  return (
    <Stack>
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title={title} />
          <Flex align="center" gap="xs">
            <Flex align="center" gap={5}>
              <Text fw={700}>
                {page === 1 ? 1 : (page - 1) * limit + 1}-{page === 1 ? limit : Math.min(page * limit, totalElements)}
              </Text>
              <Text>de</Text>
              <Text fw={700}>
                {totalElements} {elementsName}
              </Text>
            </Flex>
            <Button
              color={colors.main_app_color}
              className={`text-white text-md px-3 py-2 bg-primary_button mb-0 ${user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? "" : "hidden"}`}
              onClick={onNewItemClick}>
              Nuevo
            </Button>
          </Flex>
        </Flex>
      </Group>

      <Group grow>
        {loadingElements ? (
          <Box className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
            <Loader color={colors.main_app_color} />
          </Box>
        ) : elementsList && elementsList?.length > 0 ? (
          <Grid>
            {elementsList?.map((item, key) => (
              <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={key}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    {item?.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]?.location}
                        h={200}
                        fit={elementsName === "platillos" ? "contain" : "cover"}
                        alt={item?.name || "Imagen"}
                      />
                    ) : (
                      <Image src="default-image-url.jpg" h={200} fit="cover" alt="Imagen no disponible" />
                    )}
                  </Card.Section>

                  <Group justify="space-between" mt="md" mb="xs">
                    <Box w={160}>
                      <Tooltip
                        label={item?.name}
                        position="bottom-start"
                        transitionProps={{ transition: "fade-down", duration: 300 }}>
                        <Text truncate="end" size="lg" fw={700}>
                          {item?.name}
                        </Text>
                      </Tooltip>
                    </Box>
                    <MantineProvider theme={theme}>
                      <Switch
                        checked={item?.isActive}
                        onChange={() => (item?.isActive ? onDisableItem(item?.id) : onEnableItem(item?.id))}
                        color={colors.main_app_color}
                        size="md"
                        thumbIcon={
                          item?.isActive ? (
                            <IconCheck style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          ) : (
                            <IconX style={{ width: rem(12), height: rem(12) }} stroke={3} color={colors.main_app_color} />
                          )
                        }
                      />
                    </MantineProvider>
                  </Group>

                  <Text size="sm" c="dimmed" h={50}>
                    {elementsName === "restaurantes"
                      ? item?.socialReason
                      : elementsName === "sucursales"
                        ? item?.city + ", " + item?.state
                        : getFormattedHNL(item?.price)}
                  </Text>

                  <Button color={colors.main_app_color} fullWidth mt="md" radius="md" onClick={() => onDetailsClick(item?.id)}>
                    Ver detalles
                  </Button>
                </Card>
              </Grid.Col>
            ))}
            <Grid.Col>
              <Flex justify="end">
                <Pagination
                  total={totalPageCount}
                  page={page}
                  limit={limit}
                  defaultValue={page}
                  onChange={onPaginationChange}
                  color={colors.main_app_color}
                  size="md"
                  withEdges
                />
              </Flex>
            </Grid.Col>
          </Grid>
        ) : (
          <Box>
            <Flex direction="column" align="center">
              <Lottie options={defaultOptions} height={440} width={440} />
            </Flex>
          </Box>
        )}
      </Group>
    </Stack>
  )
}

export default CardsViewLayout

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
  rem,
  ActionIcon,
  Modal,
  Paper,
  useMantineColorScheme,
  Divider,
  ScrollArea,
  SimpleGrid,
  Accordion
} from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import BackButton from "./Dishes/components/BackButton"
import { colors } from "../theme/colors"
import { formatTime, getFormattedHNL } from "../utils"
import Lottie from "react-lottie"
import animationData from "../assets/animation/NothingFoundAnimation.json"
import { APP_ROLES, KITCHEN_SCROLL_VIEW_HEIGHT } from "../utils/constants"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconQrcode } from "@tabler/icons-react"
import { QRCodeCanvas } from "qrcode.react"
import { useState } from "react"
import { IconPrinter } from "@tabler/icons-react"
import { createRoot } from "react-dom/client"
import { SearchComponent } from "../components/SearchComponent"
import classes from "../screens/Orders/BadgeCard.module.css"
import { IconFlame } from "@tabler/icons-react"
import { IconClock } from "@tabler/icons-react"
import { DishOrderDetailCard } from "./Orders/DishOrderDetailCard"
import ConfirmationModal from "./ConfirmationModal"
import { useStopwatch } from "react-timer-hook"
import { IconStopwatch } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useDispatch } from "react-redux"
import { cancelOrder, updateOrderStatus } from "../store/features/ordersSlice"
import { useTimer } from "react-timer-hook"
import { useSelector } from "react-redux"
import { IconNotes } from "@tabler/icons-react"
import { useEffect } from "react"

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
  user,
  onSearch,
  value,
  searchAction,
  kitchenView,
  searchOptions = [],
  selectedOption,
  setSelectedSearchOption
}) => {
  const dispatch = useDispatch()
  const [opened, { open, close }] = useDisclosure(false)
  const [openedKitchen, { close: closeKitchen, open: openKitchen }] = useDisclosure(false)
  const [openedKitchenCancel, { close: closeKitchenCancel, open: openKitchenCancel }] = useDisclosure(false)
  const [branchData, setBranchData] = useState(null)
  const { updatingOrderStatus } = useSelector((state) => state.orders)
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
  const isSmallScreen = useMediaQuery("(max-width: 430px)")
  const { colorScheme } = useMantineColorScheme()
  const [orderId, setOrderId] = useState(null)
  const [readyMap, setReadyMap] = useState({}) // { [orderId]: true } cuando el countdown termina
  const markReady = (id) => setReadyMap((prev) => ({ ...prev, [id]: true }))

  // arriba: import { useState, useEffect } from "react"

  const OrderStopwatch = ({ sentToKitchenTimestamp, isPaused }) => {
    const { days, hours, minutes, seconds, reset, pause } = useStopwatch({
      autoStart: !isPaused
    })

    useEffect(() => {
      // Calcular el tiempo transcurrido desde sentToKitchenTimestamp
      const elapsedSeconds = Math.max(0, dayjs().diff(dayjs(sentToKitchenTimestamp), "second"))
      const offset = new Date()
      offset.setSeconds(offset.getSeconds() + elapsedSeconds)

      // Resetea al tiempo correcto y arranca/pausa según isPaused
      reset(offset, !isPaused)
      if (isPaused) pause()
    }, [sentToKitchenTimestamp, isPaused, reset, pause])

    return (
      <Text size="md" fw={700}>
        {String(days).padStart(2, "0")}:{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </Text>
    )
  }

  const Countdown = ({ scheduledDate, onExpire }) => {
    const targetDate = new Date(scheduledDate)
    const { seconds, minutes, hours, days } = useTimer({
      expiryTimestamp: targetDate,
      onExpire // <-- avisa cuando llega a 0
    })

    return `Disponible dentro de ${String(days).padStart(2, "0")}d:${String(hours).padStart(2, "0")}h:${String(minutes).padStart(2, "0")}m:${String(seconds).padStart(2, "0")}s`
  }

  const handlePrint = (value) => {
    const parsedValue = JSON.parse(value)
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Código QR de ${parsedValue.sucursalName}</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #ffffff;
              }
              .qr-container {
                width: 350px;
                text-align: center;
                position: relative;
              }
              .menu-header {
                color: #EE364C;
                font-size: 3.5rem;
                padding: 10px 0;
                font-weight: bold;
              }
              .scan-label {
                position: absolute;
                top: 100px;
                right: 0px;
                color: #EE364C;
                font-size: 1.5rem;
                padding: 5px 10px;
                border-radius: 5px;
                transform: translateY(-40%);
              }
              .qr-box {
                margin: 50px auto;
                width: 350px;
                height: 350px;
                border: 4px solid #EE364C;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .qr-code {
                width: 80%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="menu-header">Bienvenido</div>
              <div class="scan-label">¡Escanéame!</div>
              <div class="qr-box" id="qr-root"></div>
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()

      const qrRoot = printWindow.document.getElementById("qr-root")
      const root = createRoot(qrRoot)
      root.render(<QRCodeCanvas value={value} size={300} bgColor="transparent" fgColor="#000" />)

      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  }

  return (
    <Stack gap="xs">
      {!kitchenView && (
        <Group grow>
          <Flex align="center" justify="space-between">
            <BackButton title={title} />
            <Flex align="center" gap="xs">
              <Flex style={{ display: `${isSmallScreen ? "none" : ""}` }} align="center" gap={5}>
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
                style={{
                  display: `${user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? "" : "none"}`
                }}
                onClick={onNewItemClick}>
                Nuevo
              </Button>
            </Flex>
          </Flex>
        </Group>
      )}
      {user.role !== "kitchen" && (
        <SearchComponent
          onSearch={onSearch}
          elementName={elementsName}
          value={value}
          searchAction={searchAction}
          searchOptions={searchOptions}
          selectedOption={selectedOption}
          setSelectedSearchOption={setSelectedSearchOption}
        />
      )}

      <Group grow>
        {loadingElements ? (
          <Box className="h-[calc(100vh-220px)] w-full flex justify-center items-center">
            <Loader color={colors.main_app_color} />
          </Box>
        ) : elementsList && elementsList?.length > 0 ? (
          !kitchenView ? (
            <Grid gutter="sm">
              {elementsList?.map((item, key) => (
                <Grid.Col span={{ base: 12, md: 6, lg: 4, xl: 3 }} key={key}>
                  <Card shadow="sm" padding="sm" radius="md" withBorder>
                    <Card.Section style={{ position: "relative" }}>
                      {elementsName === "sucursales" && item?.onSite && (
                        <Tooltip
                          transitionProps={{ transition: "slide-down", duration: 300 }}
                          arrowOffset={50}
                          arrowSize={4}
                          label="Generar código QR"
                          color={colors.main_app_color}
                          position="bottom-start">
                          <ActionIcon
                            color={colors.main_app_color}
                            style={{ position: "absolute", left: 12, top: 12 }}
                            variant="filled"
                            size="md"
                            onClick={() => {
                              open()
                              setBranchData({ id: item?.id, name: item?.name })
                            }}>
                            <IconQrcode style={{ width: "80%", height: "80%" }} stroke={1.5} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                      {item?.images && item?.images?.length > 0 ? (
                        <Image
                          src={item?.images[0]?.location}
                          h={160}
                          fit={elementsName === "productos" ? "contain" : "cover"}
                          alt={item?.name || "Imagen"}
                          fallbackSrc="https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg"
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
                          transitionProps={{ transition: "fade-down", duration: 300 }}
                          color={colors.main_app_color}>
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
                      {elementsName === "comercios"
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
              {totalElements > limit && (
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
              )}
            </Grid>
          ) : (
            <Grid gutter="sm">
              {elementsList?.map((item, key) => {
                const isScheduled = Boolean(item?.scheduledDate) && !item?.isWantedAsSoonAsItIsReady
                const isPast = isScheduled ? dayjs().isAfter(dayjs(item.scheduledDate)) : true
                const isAvailable = !isScheduled || isPast || readyMap[item.id] === true
                const isStopwatchPaused = isScheduled && !isAvailable
                return (
                  <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={key}>
                    <Paper withBorder radius="md" p="md" className={classes.card}>
                      <Stack gap="xs" style={{ position: "relative" }}>
                        {item.sentToKitchenTimestamp && (
                          <Flex align="start" gap={2} style={{ position: "absolute", top: 3, right: 3 }}>
                            <IconStopwatch size={24} />
                            <OrderStopwatch sentToKitchenTimestamp={item.sentToKitchenTimestamp} isPaused={isStopwatchPaused} />
                          </Flex>
                        )}

                        <Flex align="center" gap="xs">
                          <Flex direction="column" gap={5}>
                            <Flex direction="column">
                              <Text c="dimmed" size="sm">
                                Cliente:
                              </Text>
                              <Text size="sm">{item?.Order?.User?.name || "Desconocido"}</Text>
                            </Flex>
                            <Flex direction="column">
                              <Text c="dimmed" size="sm">
                                Número de pedido:
                              </Text>
                              <Text size="sm">{item?.orderId}</Text>
                            </Flex>
                            <Flex direction="column">
                              <Text c="dimmed" size="sm">
                                Tipo de pedido:
                              </Text>
                              <Text size="sm">
                                {item?.serviceType === "delivery"
                                  ? "A domicilio"
                                  : item?.serviceType === "onSite"
                                    ? "Venta en mesa"
                                    : "Para llevar"}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>

                        <Flex justify="space-between" align="center">
                          <Flex align="center" gap={2}>
                            <Text size="sm" fw={600}>Creado el {formatTime(item.createdAt)}</Text>
                          </Flex>
                          <Flex align="center" gap={2}>
                            {item.isWantedAsSoonAsItIsReady ? <IconFlame size={18} /> : <IconClock size={18} />}
                            <Text size="sm">{item.isWantedAsSoonAsItIsReady ? "Pedido inmediato" : "Pedido programado"}</Text>
                          </Flex>
                        </Flex>

                        <Divider my={1} />

                        <ScrollArea h={KITCHEN_SCROLL_VIEW_HEIGHT}>
                          <SimpleGrid spacing={8} pb={1}>
                            {item.note && (
                              <Accordion variant="separated" radius="md">
                                <Accordion.Item value="order-note">
                                  <Accordion.Control icon={<IconNotes size={20} />} fz="sm">
                                    Nota del pedido
                                  </Accordion.Control>
                                  <Accordion.Panel fz="sm">{item?.note}</Accordion.Panel>
                                </Accordion.Item>
                              </Accordion>
                            )}
                            {item?.OrderDetails?.map((detail, index) => (
                              <DishOrderDetailCard key={index} orderDetails={detail} noText />
                            ))}
                          </SimpleGrid>
                        </ScrollArea>

                        <Flex mt="xs" justify="space-between" gap={5} align="center" w="100%">
                          <Button
                            color={colors.main_app_color}
                            variant="outline"
                            onClick={() => {
                              openKitchenCancel()
                              setOrderId(item.id)
                            }}
                            radius="md"
                            size={isSmallScreen ? "xs" : "sm"}>
                            Cancelar
                          </Button>
                          <Button
                            style={{ flex: 1 }}
                            color={colors.main_app_color}
                            loading={updatingOrderStatus}
                            radius="md"
                            disabled={!isAvailable} // 🔒 bloqueado mientras corre el countdown
                            onClick={() => {
                              openKitchen()
                              setOrderId(item.id)
                            }}>
                            {isScheduled && !isAvailable ? (
                              <Countdown
                                scheduledDate={item.scheduledDate}
                                onExpire={() => markReady(item.id)} // ⏱️ cuando termina → habilita
                              />
                            ) : (
                              "Marcar como preparado"
                            )}
                          </Button>
                        </Flex>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                )
              })}

              {totalElements > limit && (
                <Grid.Col className={`${totalPageCount === 1 ? "hidden" : ""}`}>
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
              )}

              <ConfirmationModal
                opened={openedKitchen}
                close={closeKitchen}
                title="¿Estás seguro de realizar esta acción?"
                description="El pedido ya no se mostrará en esta pantalla"
                onConfirm={() => dispatch(updateOrderStatus(orderId))}
              />

              <ConfirmationModal
                opened={openedKitchenCancel}
                close={closeKitchenCancel}
                title="¿Estás seguro de cancelar este pedido?"
                description="El pedido ya no se mostrará en esta pantalla"
                onConfirm={() => dispatch(cancelOrder(orderId))}
              />
            </Grid>
          )
        ) : (
          <Box className="h-[calc(100vh-200px)] w-full flex justify-center items-center">
            <Lottie isClickToPauseDisabled={true} options={defaultOptions} height={480} width={480} />
          </Box>
        )}
      </Group>

      <Modal radius="md" opened={opened} onClose={close} title="Código QR de la sucursal" centered>
        <Stack>
          <Flex align="center" justify="center">
            <Paper withBorder p="md" radius="md" style={{ border: "solid 2px", borderColor: colors.main_app_color }}>
              <QRCodeCanvas
                value={JSON.stringify({
                  restaurantId: user?.Restaurant?.id,
                  sucursalId: branchData?.id,
                  sucursalName: branchData?.name
                })}
                size={200}
                bgColor="transparent"
                fgColor={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </Paper>
          </Flex>
          <Flex align="center" justify="center" gap="sm">
            <Button
              fullWidth
              leftSection={<IconPrinter size="1.4rem" />}
              color={colors.main_app_color}
              onClick={() =>
                handlePrint(
                  JSON.stringify({
                    restaurantId: user?.Restaurant?.id,
                    sucursalId: branchData?.id,
                    sucursalName: branchData?.name
                  })
                )
              }>
              Imprimir / Exportar PDF
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </Stack>
  )
}

export default CardsViewLayout

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
  useMantineColorScheme
} from "@mantine/core"
import { IconCheck, IconX } from "@tabler/icons-react"
import BackButton from "./Dishes/components/BackButton"
import { colors } from "../theme/colors"
import { getFormattedHNL } from "../utils"
import Lottie from "react-lottie"
import animationData from "../assets/animation/NothingFoundAnimation.json"
import { APP_ROLES } from "../utils/constants"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconQrcode } from "@tabler/icons-react"
import { QRCodeCanvas } from "qrcode.react"
import { useState } from "react"
import { IconPrinter } from "@tabler/icons-react"
import { createRoot } from "react-dom/client"

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
  const [opened, { open, close }] = useDisclosure(false)
  const [branchData, setBranchData] = useState(null)
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
    <Stack>
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
                          style={{ position: "absolute", left: 20, top: 20 }}
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

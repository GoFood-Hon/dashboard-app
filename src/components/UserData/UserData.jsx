import { Avatar, Divider, Flex, Loader, Stack, Title, Text } from "@mantine/core"
import { IconHelmet, IconUser, IconMail, IconPhone, IconId, IconMapPin } from "@tabler/icons-react"

const UserData = ({
  title,
  photo,
  name,
  email,
  phoneNumber,
  address,
  bikeId,
  isSmallScreen,
  updatingDriver,
  orderDetails,
  tableNumber
}) => {
  return (
    <Stack h="100%" gap="xs">
      <Flex align="center" gap={5}>
        {title.includes("repartidor") ? <IconHelmet size="1.1rem" /> : <IconUser size="1.1rem" />}
        <Title order={isSmallScreen ? 6 : 5}>{title}</Title>
      </Flex>
      <Divider my={2} />
      {name ? (
        <>
          <Flex align="center" gap="sm">
            <Avatar
              src={photo}
              alt="it's me"
              name={name
                ?.split(" ")
                .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase()}
            />
            <Text c="dimmed" size="sm">
              {name}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            <IconMail size="1.1rem" />
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {email}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            <IconPhone size="1.1rem" />
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {phoneNumber}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            {bikeId ? <IconId size="1.1rem" style={{ flexShrink: 0 }} /> : <IconMapPin size="1.1rem" style={{ flexShrink: 0 }} />}
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"} style={{ wordBreak: "break-word" }}>
              {bikeId
                ? bikeId
                : orderDetails?.serviceType === "delivery"
                  ? address || "No se proporcionó"
                  : "La dirección no es requerida"}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex direction="column" justify="center" align="center" style={{ flexGrow: 1 }} gap="sm">
          {tableNumber ? (
            <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
              {tableNumber ? `Pedido para la mesa #${tableNumber}` : "No se ha asignado una mesa"}
            </Text>
          ) : updatingDriver ? (
            <Loader color={colors.main_app_color} />
          ) : (
            <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
              {orderDetails?.serviceType === "delivery"
                ? orderDetails?.status === "canceled"
                  ? "No fue posible asignar un repartidor"
                  : "No se ha asignado un repartidor"
                : "No aplica para este pedido"}
            </Text>
          )}
        </Flex>
      )}
    </Stack>
  )
}

export default UserData

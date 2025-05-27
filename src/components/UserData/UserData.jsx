import { Avatar, Divider, Flex, Loader, Stack, Title, Text } from "@mantine/core"
import { IconMail, IconPhone, IconId, IconMapPin } from "@tabler/icons-react"
import { colors } from "../../theme/colors"

const UserData = ({
  title,
  icon,
  photo,
  name,
  email,
  phoneNumber,
  address,
  bikeId,
  isSmallScreen,
  updatingDriver,
  orderDetails,
  tableNumberAndText,
  noIcons
}) => {
  return (
    <Stack h="100%" gap="xs">
      <Flex align="center" gap={5}>
        {icon}
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
            {noIcons ?? <IconMail size="1.1rem" />}
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {email}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            {noIcons ?? <IconPhone size="1.1rem" />}
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"}>
              {phoneNumber}
            </Text>
          </Flex>
          <Flex align="center" gap="xs" ml={5}>
            {bikeId ? noIcons ?? <IconId size="1.1rem" style={{ flexShrink: 0 }} /> : noIcons ?? <IconMapPin size="1.1rem" style={{ flexShrink: 0 }} />}
            <Text c="dimmed" size={isSmallScreen ? "xs" : "sm"} style={{ wordBreak: "break-word" }}>
              {bikeId
                ? bikeId
                : orderDetails?.serviceType === "delivery"
                  ? address
                  : "La dirección no es requerida"}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex direction="column" justify="center" align="center" style={{ flexGrow: 1 }} gap="sm">
          {tableNumberAndText ? (
            <Text size={isSmallScreen ? "xs" : "sm"} c="dimmed">
              {tableNumberAndText ? tableNumberAndText : "No se ha asignado una mesa"}
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

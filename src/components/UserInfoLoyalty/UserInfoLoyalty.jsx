import { Avatar, Flex, Group, Paper, Text } from "@mantine/core"
import { IconMapPin } from "@tabler/icons-react"
import { IconExclamationCircleFilled } from "@tabler/icons-react"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { IconPhoneCall } from "@tabler/icons-react"
import { IconAt } from "@tabler/icons-react"
import React from "react"

const UserInfoLoyalty = ({ photo, name, email, phone, address, isVerified }) => {
  return (
    <Paper radius="md" withBorder p="xs">
      <Flex align="center" justify="space-between">
        <Flex gap={10} align="center">
          <Avatar
            src={photo || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png"}
            size={80}
            radius="md"
          />
          <Flex direction="column">
            <Text fz="lg" fw={500}>
              {name}
            </Text>

            <Group wrap="nowrap" gap={10} mt={3}>
              <IconAt stroke={1.5} size={18} />
              <Text fz="sm" c="dimmed">
                {email}
              </Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={5}>
              <IconPhoneCall stroke={1.5} size={18} />
              <Text fz="sm" c="dimmed">
                {phone}
              </Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={5}>
              <IconMapPin stroke={1.5} size={18} />
              <Text fz="sm" c="dimmed">
                {address ?? "Sin dirección"}
              </Text>
            </Group>
          </Flex>
        </Flex>
        <Flex align="center" gap={4}>
          {isVerified ? <IconCircleCheckFilled size={24} /> : <IconExclamationCircleFilled size={30} />}
          <Text c="dimmed">{isVerified ? "Cliente verificado" : "Cliente no verificado"}</Text>
        </Flex>
      </Flex>
    </Paper>
  )
}

export default UserInfoLoyalty

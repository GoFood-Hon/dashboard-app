import React from "react"
import { useNavigate } from "react-router-dom"
import { IconArrowNarrowLeft } from "@tabler/icons-react"
import { Flex, Group, Title, Text, Box } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

export default function BackButton({ title, show }) {
  const navigate = useNavigate()
  const isVerySmallScreen = useMediaQuery("(max-width: 480px)")

  return (
    <Group>
      <Flex align="center" gap="xs">
        {show && <IconArrowNarrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} size="1.6rem" />}
        {isVerySmallScreen ? (
          <Text size="xl" fw={600} truncate="end">
            {title}
          </Text>
        ) : (
          <Title order={2}>{title}</Title>
        )}
      </Flex>
    </Group>
  )
}

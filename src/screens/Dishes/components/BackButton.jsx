import React from "react"
import { useNavigate } from "react-router-dom"
import { IconArrowNarrowLeft } from "@tabler/icons-react"
import { Flex, Group, Title } from "@mantine/core"

export default function BackButton({ title, show }) {
  const navigate = useNavigate()

  return (
    <Group>
      <Flex onClick={() => navigate(-1)} align='center' gap='xs'>
        {show ? <IconArrowNarrowLeft style={{cursor: 'pointer'}} size="1.6rem" /> : ""}
        <Title order={3}>{title}</Title>
      </Flex>
    </Group>
  )
}

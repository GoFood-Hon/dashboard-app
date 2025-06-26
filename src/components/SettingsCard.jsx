import { Link } from "react-router-dom"
import { Flex, Paper, Text } from "@mantine/core"
import { IconArrowRight } from "@tabler/icons-react"

export default function SettingsCard({ title, icon: Icon, linkPage, children }) {
  return (
    <Paper withBorder radius="md">
      <Paper withBorder p="sm" radius="md">
        <Flex align="center" direction="row" justify="space-between">
          <Flex align="center" gap="xs">
            {Icon && <Icon size="1.4rem" />}
            <Text fw={700}>{title}</Text>
          </Flex>
          {linkPage && (
            <Link to={linkPage}>
              <IconArrowRight />
            </Link>
          )}
        </Flex>
      </Paper>
      <Paper p="lg" radius="md">
        {children}
      </Paper>
    </Paper>
  )
}
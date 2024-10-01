import { Avatar, Flex, Text, UnstyledButton } from "@mantine/core"
import classes from "./UserButton.module.css"

export function UserButton({ image, name, email }) {
  return (
    <Flex direction="row" gap={8}>
      <div>
        <Text size="sm" ta={'right'}>{name}</Text>

        <Text color="dimmed" size="xs">
          {email}
        </Text>
      </div>
      <Avatar src={image} radius="xl" />
    </Flex>
  )
}

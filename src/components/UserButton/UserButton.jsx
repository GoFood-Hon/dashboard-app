import { Avatar, Flex, Text, UnstyledButton } from "@mantine/core"
import classes from "./UserButton.module.css"

export function UserButton({ image, name, email }) {
  return (
    <UnstyledButton className={classes.user}>
      <Flex direction="row" gap={8}>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" style={{ width: 500 }}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>
      </Flex>
    </UnstyledButton>
  )
}

import { Avatar, Flex, Text, UnstyledButton } from "@mantine/core"
import classes from "./UserButton.module.css"
import { colors } from "../../theme/colors"

export function UserButton({ image, name, email }) {
  return (
    <Flex direction="row" gap={8}>
      <div>
        <Text size="sm" ta={"right"}>
          {name}
        </Text>

        <Text color="dimmed" size="sm">
          {email}
        </Text>
      </div>
      <Avatar color={colors.main_app_color} radius="xl">
        {name
          ?.split(" ")
          .filter((_, i, arr) => i === 0 || i === arr.length - 1)
          .map((palabra) => palabra.charAt(0))
          .join("")}
      </Avatar>
    </Flex>
  )
}

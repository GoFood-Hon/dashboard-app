import { Avatar, Flex, Text } from "@mantine/core"
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
      <Avatar
        src={image}
        alt="it's me"
        name={name
          ?.split(" ")
          .filter((_, i, arr) => i === 0 || i === arr.length - 1)
          .map((palabra) => palabra.charAt(0))
          .join("")
          .toUpperCase()}
        color={colors.main_app_color}
      />
    </Flex>
  )
}

import { Skeleton, Stack, NumberFormatter } from "@mantine/core"
import { Group, Paper, SimpleGrid, Text } from "@mantine/core"
import classes from "../../assets/css/StatsGrid.module.css"
import { cardsAdminDataStructure, cardsDataStructure } from "../../utils/constants"

export const DashboardScreen = ({ userRole, cardsStats, loadingStats }) => {
  const data = userRole === "superadmin" ? cardsAdminDataStructure(cardsStats) : cardsDataStructure(cardsStats)

  const stats = data.map((stat) => {
    return (
      <Stack gap="sm" key={stat.title}>
        <Paper withBorder p="md" radius="md" key={stat.title}>
          <Group justify="space-between">
            <Text size="xs" c="dimmed" className={classes.title}>
              {stat.title}
            </Text>
            <stat.icon className={classes.icon} size="1.4rem" stroke={1.5} />
          </Group>

          <Group align="flex-end" gap="xs" mt={20}>
            {loadingStats ? (
              <Skeleton height={25} w={200} mt="xs" />
            ) : stat.type === "time" ? (
              <Text fz="h3" fw={700} className={classes.value}>
                <NumberFormatter
                  value={stat.value || 0}
                  suffix=" minutos"
                  decimalScale={0}
                  thousandSeparator="."
                  decimalSeparator=","
                  className={classes.value}
                />
              </Text>
            ) : (
              <Text fz="h3" fw={700} className={classes.value}>
                {stat.value || 0}
              </Text>
            )}
          </Group>

          <Text fz="sm" c="dimmed">
            {stat.text}
          </Text>
        </Paper>
      </Stack>
    )
  })

  return (
    <SimpleGrid spacing="xs" cols={{ base: 1, xs: 2, md: 4 }}>
      {stats}
    </SimpleGrid>
  )
}

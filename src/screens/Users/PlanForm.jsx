import { Button, Flex, Paper, Stack, Text, ThemeIcon, rem } from "@mantine/core"
import { PlanInfoCard } from "../../components/Plans/PlanInfoCard"
import { SelectPlan } from "./SelectPlan"
import { IconAlertCircleFilled, IconCircleCheckFilled } from "@tabler/icons-react"

export const PlanForm = ({
  planCancelled,
  newPlan,
  setNewPlan,
  classes,
  colors,
  restaurantDetails,
  handlePlanCancel,
  handleSelectNewPlan,
  restaurantId
}) => (
  <>
    {planCancelled ? (
      <section className="my-2">
        <Paper p="xl" withBorder radius="md" className={classes.card}>
          <Stack>
            <Flex align="center" gap="sm">
              <ThemeIcon size="lg" radius="md" variant="gradient" gradient={{ deg: 0, from: "#EE364C", to: "#EDB23B" }}>
                <IconAlertCircleFilled style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
              </ThemeIcon>
              <Text c="dimmed" size="sm" fw={500}>
                Su plan actual será cancelado una vez que presione el botón actualizar
              </Text>
            </Flex>
          </Stack>
        </Paper>
      </section>
    ) : null}

    {Object.keys(newPlan).length !== 0 ? (
      <section className="my-2">
        <Paper p="xl" withBorder radius="md" className={classes.card}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap="sm">
              <ThemeIcon size="lg" radius="md" variant="filled" color="green">
                <IconCircleCheckFilled style={{ width: rem(28), height: rem(28) }} stroke={1.5} />
              </ThemeIcon>
              <Text c="dimmed" size="sm" fw={500}>
                Usted seleccionó el PLAN {newPlan?.name?.replace("Plan", "").toUpperCase()} para este comercio
              </Text>
            </Flex>
            <Button variant="outline" onClick={() => setNewPlan({})} color={colors.main_app_color}>
              Cambiar
            </Button>
          </Flex>
        </Paper>
      </section>
    ) : null}

    <section className="my-2">
      {restaurantDetails?.Subscription && !planCancelled ? (
        <PlanInfoCard data={restaurantDetails?.Subscription} onCancelPlan={handlePlanCancel} />
      ) : Object.keys(newPlan).length === 0 ? (
        <SelectPlan restaurantId={restaurantId} onSelected={handleSelectNewPlan} currentPlan={restaurantDetails?.Subscription?.Plan?.id} />
      ) : null}
    </section>
  </>
)

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Grid, Paper, Stack, Text } from "@mantine/core"
import { getPlansFeatures } from "../../store/features/plansSlice"
import InputField from "../../components/Form/InputField"
import InputCheckbox from "../../components/Form/InputCheckbox"
import { useWatch } from "react-hook-form"

export const Characteristics = ({ register, errors, control, setValue, defaultFeatures }) => {
  const dispatch = useDispatch()
  const { featuresList } = useSelector((state) => state.plans)

  const watchFeatures = useWatch({ control, name: "features" })

  useEffect(() => {
    if (featuresList.length === 0) {
      dispatch(getPlansFeatures())
    }
  }, [dispatch, featuresList.length])

  useEffect(() => {
    if (!defaultFeatures || featuresList.length === 0) return

    const defaultMap = Object.fromEntries(defaultFeatures.map((f) => [f.id, f.PlanPlanFeatures]))

    featuresList.forEach((feature) => {
      const planValue = defaultMap[feature.id]

      if (feature.type === "boolean") {
        setValue(`features.${feature.id}.available`, planValue?.available ?? false)
      } else if (feature.type === "amount") {
        setValue(`features.${feature.id}.quantity`, planValue?.quantity ?? 0)
      }
    })
  }, [defaultFeatures, featuresList, setValue])

  return (
    <Grid>
      <Grid.Col span={{ base: 12 }}>
        <Paper withBorder radius="md" p="md">
          <Stack>
            {featuresList
              .slice()
              .sort((a, b) => {
                if (a.type === "amount" && b.type === "boolean") return -1
                if (a.type === "boolean" && b.type === "amount") return 1
                return 0
              })
              .map((feature) => {
                const watchedValue = watchFeatures?.[feature.id]?.available
                const defaultValue = defaultFeatures?.find((f) => f.id === feature.id)?.PlanPlanFeatures?.available
                const isChecked = typeof watchedValue === "boolean" ? watchedValue : Boolean(defaultValue)

                return (
                  <Grid key={feature.id} align="center">
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500}>
                        {feature.name}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      {feature.type === "boolean" ? (
                        <InputCheckbox
                          label={isChecked ? "Habilitado" : "Deshabilitado"}
                          name={`features.${feature.id}.available`}
                          register={register}
                          labelPosition="right"
                        />
                      ) : (
                        <InputField type="number" name={`features.${feature.id}.quantity`} register={register} errors={errors} />
                      )}
                    </Grid.Col>
                  </Grid>
                )
              })}
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

import { ActionIcon, Flex, Grid, Paper, Switch, Text, ThemeIcon, Tooltip, rem } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"
import React, { useEffect, useState, useRef } from "react"
import { colors } from "../../theme/colors"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { IconMoon } from "@tabler/icons-react"

dayjs.extend(utc)
dayjs.extend(timezone)

export default function TimeForm({ setValue, scheduleModels }) {
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const daysOfWeekEn = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const ref = useRef(null)
  const [alwaysAvailable, setAlwaysAvailable] = useState(false)
  const [switchStatus, setSwitchStatus] = useState(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: false }), {}))
  const [schedule, setSchedule] = useState(
    daysOfWeekEn.map(() => ({
      from: null,
      until: null
    }))
  )

  const getTimePickerControl = (dayIndex, type) => (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref?.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  )

  const handleIsAlwaysAvailable = (event) => {
    setAlwaysAvailable(event.currentTarget.checked)
    setValue("alwaysOpen", event.currentTarget.checked)
  }

  const handleTimeChange = (dayIndex, type, value) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex][type] = value
    setSchedule(updatedSchedule)
  }

  const generateSchedule = () => {
    return daysOfWeekEn
      .map((day, index) => {
        if (switchStatus[daysOfWeek[index]] && schedule[index]?.from && schedule[index]?.until) {
          const today = dayjs().format("YYYY-MM-DD")

          const openTime = dayjs(`${today} ${schedule[index].from}`).isValid()
            ? dayjs(`${today} ${schedule[index].from}`).format("HH:mm:ss")
            : "00:00:00"

          const closeTime = dayjs(`${today} ${schedule[index].until}`).isValid()
            ? dayjs(`${today} ${schedule[index].until}`).format("HH:mm:ss")
            : "00:00:00"

          return { day, openTime, closeTime }
        }
        return null
      })
      .filter(Boolean)
  }

  const setBranchSchedule = () => {
    setValue("schedule", generateSchedule())
  }

  // Ejecutar setBranchSchedule cuando se cambian los horarios o los switch
  useEffect(() => {
    setBranchSchedule()
  }, [schedule, switchStatus])

  return (
    <div className="w-full h-full rounded-2xl p-4">
      <section>
        <Grid justify="space-between" align="center" grow>
          <Grid.Col span={{ base: 6 }}>
            <label className="text-sm font-bold leading-snug mb-2">Habilitar</label>
            <Text className="font-semibold" size="sm" c="dimmed" inline>
              Habilita o deshabilita el horario de la sucursal. El deshabilitar el horario de la sucursal la convierte 24/7
            </Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <Flex justify="flex-end">
              <Tooltip label="Si se deshabilita el horario será 24/7">
                <Switch checked={alwaysAvailable} color={colors.main_app_color} size="sm" onChange={handleIsAlwaysAvailable} />
              </Tooltip>
            </Flex>
          </Grid.Col>
          {daysOfWeek.map((day, index) => (
            <React.Fragment key={day}>
              <Grid.Col span={{ base: 6 }}>
                <div className="flex flex-row items-center h-full w-full">
                  <Switch
                    disabled={alwaysAvailable}
                    color={colors.main_app_color}
                    size="sm"
                    checked={switchStatus[day]}
                    onChange={() => {
                      setSwitchStatus((prev) => ({
                        ...prev,
                        [day]: !prev[day]
                      }))
                    }}
                  />
                  <label className="text-sm font-bold leading-snug ml-2">{day}</label>
                </div>
              </Grid.Col>
              {switchStatus[day] ? (
                <>
                  <Grid.Col key={`${day}-from`} span={{ base: 3 }}>
                    <TimeInput
                      id={`from-${index}`}
                      value={schedule[index].from}
                      onChange={(e) => handleTimeChange(index, "from", e.target.value)}
                      color={colors.primary_button}
                      rightSection={getTimePickerControl(index, "from")}
                      leftSection={
                        <Text className="font-semibold" size="sm" c="dimmed" inline>
                          De:
                        </Text>
                      }
                      
                    />
                  </Grid.Col>
                  <Grid.Col key={`${day}-until`} span={{ base: 3 }}>
                    <TimeInput
                      id={`until-${index}`}
                      value={schedule[index].until}
                      onChange={(e) => handleTimeChange(index, "until", e.target.value)}
                      color={colors.primary_button}
                      rightSection={getTimePickerControl(index, "until")}
                      leftSection={
                        <Text className="font-semibold mx-10" size="sm" c="dimmed" inline>
                          A:
                        </Text>
                      }
                    />
                  </Grid.Col>
                </>
              ) : (
                <Grid.Col span={{ base: 6 }}>
                  <Paper withBorder color={colors.main_app_color} py={3} px={6}>
                    <Flex gap={3} align="center">
                      <ThemeIcon variant="transparent" color={colors.main_app_color}>
                        <IconMoon size='1.2rem' />
                      </ThemeIcon>
                      <Text size="sm" color={colors.main_app_color}>Cerrado</Text>
                    </Flex>
                  </Paper>
                </Grid.Col>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </section>
    </div>
  )
}

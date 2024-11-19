import React, { useState, useEffect } from "react"
import { TimeInput } from "@mantine/dates"
import { Flex, Grid, Paper, Switch, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { colors } from "../../theme/colors"
import { IconMoon } from "@tabler/icons-react"
import { daysOfWeek, daysOfWeekEn } from "../../utils/constants"
import { IconRosetteDiscountCheckFilled } from "@tabler/icons-react"

export const TimeForm = ({ setDaysData, hoursData, isAlwaysOpen, setIsAlwaysOpen }) => {
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    if (hoursData && hoursData.length > 0) {
      setSchedule(
        hoursData.map((day) => ({
          id: day.id,
          idSucursal: day.idSucursal,
          day: day.day,
          openTime: day.openTime || "",
          closeTime: day.closeTime || "",
          isClosed: day.isClosed || false
        }))
      )
    } else {
      setSchedule(
        daysOfWeekEn.map((day, i) => ({
          id: i + 1,
          idSucursal: i + 1,
          day,
          openTime: "",
          closeTime: "",
          isClosed: true
        }))
      )
    }
  }, [hoursData])

  const handleInputChange = (index, field, value) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[index][field] = value

    if (field === "isClosed" && value) {
      updatedSchedule[index].openTime = "00:00:00"
      updatedSchedule[index].closeTime = "00:00:00"
    }

    setSchedule(updatedSchedule)
  }

  const toggleStatus = (index) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[index].isClosed = !updatedSchedule[index].isClosed

    if (updatedSchedule[index].isClosed) {
      updatedSchedule[index].openTime = "00:00:00"
      updatedSchedule[index].closeTime = "00:00:00"
    }

    setSchedule(updatedSchedule)
  }

  const handleSave = () => {
    const dailyData = schedule.map((day) => ({
      day: day.day,
      openTime: day.openTime || "00:00:00",
      closeTime: day.closeTime || "00:00:00",
      isClosed: day.isClosed || false
    }))

    const updatedDaysData = {}
    daysOfWeek.forEach((day, index) => {
      updatedDaysData[index] = dailyData[index]
    })

    setDaysData(updatedDaysData)
  }

  useEffect(() => {
    handleSave()
  }, [schedule])

  return (
    <div className="flex flex-col gap-4">
      <section>
        <Grid justify="space-between" align="center" grow>
          <Grid.Col span={{ base: 6 }}>
            <label className="text-sm font-bold leading-snug mb-2">Marcar como 24/7</label>
            <Text className="font-semibold" size="sm" c="dimmed" inline>
              Si seleccionas esta opción el restaurante se mostrará como siempre abierto
            </Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <Flex justify="flex-end">
              <Tooltip label="Si se deshabilita el horario será 24/7">
                <Switch
                  checked={isAlwaysOpen}
                  color={colors.main_app_color}
                  size="sm"
                  onChange={(e) => {
                    setIsAlwaysOpen(e.currentTarget.checked)
                    setSchedule(
                      daysOfWeekEn.map((day, i) => ({
                        id: i + 1,
                        idSucursal: i + 1,
                        day,
                        openTime: "",
                        closeTime: "",
                        isClosed: true
                      }))
                    )
                  }}
                />
              </Tooltip>
            </Flex>
          </Grid.Col>
          {isAlwaysOpen ? (
            <Grid.Col>
              <Paper bg={colors.main_app_color} withBorder p="lg" radius="md" shadow="md">
                <Flex align="center" justify="center" gap="xs">
                  <IconRosetteDiscountCheckFilled color="white" size={40} />
                  <Text color="white" fw={700}>Esta sucursal estará abierta al público las 24 horas del día</Text>
                </Flex>
              </Paper>
            </Grid.Col>
          ) : (
            schedule.map((day, index) => (
              <React.Fragment key={day.id || index}>
                <Grid.Col span={{ base: 6 }}>
                  <div className="flex flex-row items-center h-full w-full">
                    <Switch
                      label={daysOfWeek[index]}
                      checked={!day.isClosed}
                      onClick={() => toggleStatus(index)}
                      color={colors.main_app_color}
                    />
                  </div>
                </Grid.Col>
                {!day.isClosed ? (
                  <>
                    <Grid.Col span={{ base: 3 }}>
                      <TimeInput
                        required
                        disabled={day.isClosed}
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="Hora de entrada"
                        step={3600}
                        type="time"
                        value={!day.isClosed ? day.openTime || "00:00" : "00:00"}
                        onChange={(e) => handleInputChange(index, "openTime", e.target.value)}
                        withSeconds
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 3 }}>
                      <TimeInput
                        required
                        disabled={day.isClosed}
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="Hora de salida"
                        step={3600}
                        value={!day.isClosed ? day.closeTime || "00:00" : "00:00"}
                        onChange={(e) => handleInputChange(index, "closeTime", e.target.value)}
                        withSeconds
                      />
                    </Grid.Col>
                  </>
                ) : (
                  <Grid.Col span={{ base: 6 }}>
                    <Paper withBorder color={colors.main_app_color} py={3} px={6}>
                      <Flex gap={3} align="center">
                        <ThemeIcon variant="transparent" color={colors.main_app_color}>
                          <IconMoon size="1.2rem" />
                        </ThemeIcon>
                        <Text size="sm" color={colors.main_app_color}>
                          Cerrado
                        </Text>
                      </Flex>
                    </Paper>
                  </Grid.Col>
                )}
              </React.Fragment>
            ))
          )}
        </Grid>
      </section>
    </div>
  )
}

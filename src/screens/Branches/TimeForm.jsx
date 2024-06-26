import { ActionIcon, Flex, Grid, Switch, Text, Tooltip, rem } from "@mantine/core"
import { TimeInput } from "@mantine/dates"
import { IconClock } from "@tabler/icons-react"
import React, { useEffect, useRef, useState } from "react"
import { colors } from "../../theme/colors"
import { Icon } from "../../components/Icon"
import Button from "../../components/Button"
import toast from "react-hot-toast"

export default function TimeForm({ setValue }) {
  const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const [alwaysAvailable, setAlwaysAvailable] = useState(false)
  const [switchStatus, setSwitchStatus] = useState(daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: false }), {}))
  const [schedule, setSchedule] = useState([])

  const timeRefs = useRef(daysOfWeek.map(() => ({ from: React.createRef(), until: React.createRef() }))).current

  const getTimePickerControl = (dayIndex, type) => (
    <ActionIcon variant="subtle" color="gray" onClick={() => timeRefs[dayIndex][type].current.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  )

  useEffect(() => {}, [switchStatus])

  const handleIsAlwaysAvailable = (event) => {
    setAlwaysAvailable(event.currentTarget.checked)
    setValue("alwaysOpen", event.currentTarget.checked)
  }

  const generateSchedule = () => {
    return daysOfWeek.map((day) => {
      if (switchStatus[day]) {
        const fromRef = timeRefs[daysOfWeek.indexOf(day)].from.current
        const untilRef = timeRefs[daysOfWeek.indexOf(day)].until.current

        const openingTime = fromRef ? fromRef.value : null
        const closingTime = untilRef ? untilRef.value : null

        return {
          day,
          openingTime,
          closingTime
        }
      } else {
        return {
          day,
          openingTime: null,
          closingTime: null
        }
      }
    })
  }
  const setBranchSchedule = () => {
    setValue("schedule", generateSchedule())
    toast.success("Horario establecido!")
  }
  return (
    <div className="w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
      <section>
        <Grid justify="space-between" align="center" grow>
          <Grid.Col span={{ base: 6 }}>
            <label className="text-sky-950 text-sm font-bold leading-snug mb-2">Habilitar</label>
            <Text className="font-semibold" size="sm" c="dimmed" inline>
              Habilita o deshabilita el horario de la sucursal. El deshabilitar el horario de la sucursal la convierte 24/7
            </Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <Flex justify="flex-end">
              <Tooltip label="Si se deshabilita el horario sera 24/7" refProp="rootRef">
                <Switch checked={alwaysAvailable} color="teal" size="sm" onChange={handleIsAlwaysAvailable} />
              </Tooltip>
            </Flex>
          </Grid.Col>
          {daysOfWeek.map((day, index) => (
            <React.Fragment key={day}>
              <Grid.Col span={{ base: 6 }}>
                <div className="flex flex-row items-center h-full w-full">
                  <Switch
                    disabled={alwaysAvailable}
                    color="teal"
                    size="sm"
                    checked={switchStatus[day]}
                    onChange={() => {
                      setSwitchStatus((prev) => ({
                        ...prev,
                        [day]: !prev[day]
                      }))
                    }}
                  />
                  <label className="text-sky-950 text-sm font-bold leading-snug ml-2">{day}</label>
                </div>
              </Grid.Col>
              {switchStatus[day] ? (
                <>
                  <Grid.Col key={`${day}-from`} span={{ base: 3 }}>
                    <TimeInput
                      ref={timeRefs[index].from}
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
                      ref={timeRefs[index].until}
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
                  <div className="bg-rose-100 rounded-lg border border-red-400 flex w-full items-center p-3">
                    <Icon icon="moon" size={17} />
                    <span className="text-red-400 text-xs font-bold ">Cerrado</span>
                  </div>
                </Grid.Col>
              )}
            </React.Fragment>
          ))}
          <div className="m-4 w-full flex justify-end">
            <div
              className="cursor-pointer space-x-3 flex h-10 w-auto items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              onClick={() => setBranchSchedule()}>
              <React.Fragment>
                <p className="w-full whitespace-nowrap px-4">Establecer horario</p>
              </React.Fragment>
            </div>
          </div>
        </Grid>
      </section>
    </div>
  )
}

/*
<div className=" bg-rose-100 rounded-lg border border-red-400 flex w-full items-center p-3">
<Icon icon="moon" size={17} />
</div> */

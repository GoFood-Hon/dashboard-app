import React, { useEffect, useState } from "react"
import { Flex, Grid, Group, Select, Stack, Tabs, rem } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import InputField from "../../components/Form/InputField"
import { Controller, useForm } from "react-hook-form"
import restaurantsApi from "../../api/restaurantApi"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { colors } from "../../theme/colors"
import BackButton from "../Dishes/components/BackButton"

export default function BankSettings() {
  const user = useSelector((state) => state.user.value)

  const [banks, setBanks] = useState([])

  const {
    register,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      try {
        const response = await restaurantsApi.getRestaurant(user?.restaurantId)

        if (response.error) {
          toast.error(`Failed to fetch restaurant information. Please try again. ${response.message}`, {
            duration: 7000
          })
          return {}
        } else {
          return response.data
        }
      } catch (error) {
        toast.error(`Failed to fetch restaurant information. Please try again.`, {
          duration: 7000
        })
        throw error
      }
    }
  })

  const transformApiData = (apiData) => {
    return apiData.map((item) => ({
      value: item.id,
      label: item.name
    }))
  }

  useEffect(() => {
    const getBankList = async () => {
      try {
        const response = await restaurantsApi.getBankList()

        if (response.error) {
          toast.error(`Fallo al obtener la lista de bancos. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          const transformedBanks = transformApiData(response.data)
          setBanks(transformedBanks)
        }
      } catch (error) {
        toast.error(`Error. Por favor intente de nuevo. ${error}`, {
          duration: 7000
        })
      }
    }
    getBankList()
  }, [])

  return (
    <Stack gap='xs'>
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title="Banco" />
        </Flex>
      </Group>
      <Tabs defaultValue="banks" color={colors.main_app_color}>
        <Tabs.List>
          <Tabs.Tab value="banks">Bancos</Tabs.Tab>
          <Tabs.Tab value="api">API</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="banks" pt='sm'>
          <SettingsCard title="Banco" iconName="bank">
            <Grid my={20}>
              <Grid.Col span={{ sm: 12 }}>
                <span className="text-sm font-bold leading-snug">Banco</span>
                <Controller
                  control={control}
                  name="bank"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      placeholder="Seleccione banco"
                      data={banks}
                      allowDeselect={false}
                      size="md"
                      onChange={onChange}
                      onBlur={onBlur}
                      selected={value}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="Titular de la cuenta" name="bankAccountOwner" register={register} errors={errors} />
              </Grid.Col>
            </Grid>
          </SettingsCard>
        </Tabs.Panel>
        <Tabs.Panel value="api" pt='sm'>
          <SettingsCard title="Accesos de la API" iconName="creditCard">
            <Grid my={20}>
              <Grid.Col span={{ sm: 12 }}>
                <InputField label="CLIENT ID" name="bankClientId" register={register} errors={errors} />
              </Grid.Col>
              <Grid.Col>
                <InputField label="TOKEN" name="bankToken" register={register} errors={errors} />
              </Grid.Col>
            </Grid>
          </SettingsCard>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

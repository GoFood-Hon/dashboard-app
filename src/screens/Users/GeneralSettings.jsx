import React, { useEffect, useState } from "react"
import { Avatar, Box, Divider, Flex, Image, Paper, Text } from "@mantine/core"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import restaurantsApi from "../../api/restaurantApi"
import { useSelector } from "react-redux"
import SettingsCard from "../../components/SettingsCard"
import toast from "react-hot-toast"
import authApi from "../../api/authApi"

export default function GeneralSettings() {
  const user = useSelector((state) => state.user.value)
  const [restaurants, setRestaurants] = useState({})
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const fetchRestaurantInformation = async () => {
      try {
        const response = await restaurantsApi.getRestaurant(user?.restaurantId)

        if (response.error) {
          toast.error(`Fallo al obtenerla información del restaurante. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          setRestaurants(response.data)
        }
      } catch (error) {
        toast.error(`Fallo al obtenerla información del restaurante. Por favor intente de nuevo.`, {
          duration: 7000
        })
        throw error
      }
    }
    fetchRestaurantInformation()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getUser()

        if (response.error) {
          toast.error("Error en la respuesta de la información del usuario")
        } else {
          setUserData(response.data.data)
        }
      } catch (error) {
        toast.error("Error obteniendo información del usuario")
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-3">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">General</h1>
          </div>
        </div>
      </section>

      <SettingsCard title="Negocio" iconName="building" linkPage={SETTING_NAVIGATION_ROUTES.Business_btn.path}>
        <Paper py="md">
          <Flex align="center" justify="space-between">
            <Flex align="center" gap="xs">
              <Image src={restaurants?.images?.[0]?.location} h={50} w={150} fit="contain" radius="md" />
              <Box>
                <Text fw={700}>{restaurants.name}</Text>
                <Text c="dimmed" size="sm">
                  {restaurants.socialReason}
                </Text>
              </Box>
            </Flex>
            <Box>
              <Text c="dimmed">{restaurants?.isActive ? "Habilitado" : "Deshabilitado"}</Text>
            </Box>
          </Flex>
        </Paper>

        <Divider />

        <Paper py="md">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fw={700}>Correo</Text>
              <Text c="dimmed">{restaurants.email}</Text>
            </Box>
            <Box>
              <Text fw={700} ta='right'>Teléfono</Text>
              <Text c="dimmed">{restaurants.phoneNumber}</Text>
            </Box>
          </Flex>
          <Box mt="md">
            <Text fw={700}>Dirección principal</Text>
            <Text c="dimmed">{restaurants.billingAddress}</Text>
          </Box>
        </Paper>

        <Divider />

        <Paper className="flex flex-row justify-between items-center py-4 flex-wrap">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fw={700}>Razón social</Text>
              <Text c="dimmed">{restaurants.socialReason}</Text>
            </Box>
            <Box>
              <Text fw={700} ta='center'>CAI</Text>
              <Text c="dimmed">{restaurants.cai}</Text>
            </Box>
            <Box>
              <Text fw={700} ta='right'>RTN</Text>
              <Text c="dimmed">{restaurants.rtn}</Text>
            </Box>
          </Flex>
        </Paper>
      </SettingsCard>

      <SettingsCard title="Cuenta" iconName="user" linkPage={SETTING_NAVIGATION_ROUTES.Cuenta.path}>
        <Paper py="md">
          <Flex align="center" gap="xs">
            <Avatar size="md" src={userData?.images?.[0]?.location} />
            <Box>
              <Text fw={700}>{userData.name}</Text>
              <Text c="dimmed">{userData.role}</Text>
            </Box>
          </Flex>
        </Paper>

        <Divider />

        <Paper py="md">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fw={700}>Correo</Text>
              <Text c="dimmed">{userData.email}</Text>
            </Box>
            <Box>
              <Text fw={700} ta='right'>Teléfono</Text>
              <Text c="dimmed">{userData.phoneNumber}</Text>
            </Box>
          </Flex>
        </Paper>
      </SettingsCard>
    </>
  )
}

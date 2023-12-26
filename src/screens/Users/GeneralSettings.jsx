import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Avatar, Breadcrumbs, Image } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"

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
    <BaseLayout>
      <div className="pl-[200px]">
        <section>
          <div className="flex flex-row justify-between items-center pb-6">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 text-2xl font-semibold">General</h1>
            </div>
            <div>
              <Breadcrumbs>
                <BreadCrumbNavigation location={location} />
              </Breadcrumbs>
            </div>
          </div>
        </section>

        <SettingsCard title="Negocio" iconName="building" linkPage={SETTING_NAVIGATION_ROUTES.Business_btn.path}>
          <div className="flex flex-row items-center  justify-between">
            <div className="flex flex-row items-center py-4">
              <Image src={restaurants?.images?.[0]?.location} h={50} w={150} fit="contain" />
              <div className="flex flex-col pl-3">
                <div className="text-sky-950 text-md font-bold leading-snug">{restaurants.name}</div>
                <div className="text-sky-950 text-xs font-normal leading-tight">{restaurants.socialReason}</div>
              </div>
            </div>
            <div className={"px-2 py-1 rounded-2xl justify-center items-center"} style={{ whiteSpace: "nowrap" }}>
              <div className="text-md">{restaurants?.isActive ? "Habilitado" : "Deshabilitado"}</div>
            </div>
          </div>

          <div className="border-b border-b-light_selected_element" />

          <div className="flex flex-row justify-between items-center py-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Correo</span>
              <span>{restaurants.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Teléfono</span>
              <span>{restaurants.phoneNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Dirección principal</span>
              <span>{restaurants.billingAddress}</span>
            </div>
          </div>

          <div className="border-b border-b-light_selected_element flex flex-row items-center w-full" />

          <div className="flex flex-row justify-between items-center py-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Razón social</span>
              <span>{restaurants.socialReason}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">CAI</span>
              <span>{restaurants.cai}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">RTN</span>
              <span>{restaurants.rtn}</span>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Cuenta" iconName="user" linkPage={SETTING_NAVIGATION_ROUTES.Cuenta.path}>
          <div className="flex flex-row item-center justify-start py-4">
            <div className="flex flex-row items-center">
              <Avatar size="md" src={userData?.images?.[0]?.location} />
            </div>
            <div className="flex flex-col pl-2">
              <span className="text-sky-950 font-semibold">{userData.name}</span>
              <span>{userData.role}</span>
            </div>
          </div>

          <div className="border-b border-b-light_selected_element" />

          <div className="flex flex-row justify-between items-center py-4">
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Correo</span>
              <span>{userData.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Teléfono</span>
              <span>{userData.phoneNumber}</span>
            </div>
          </div>
        </SettingsCard>
      </div>
    </BaseLayout>
  )
}

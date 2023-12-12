import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Avatar, Breadcrumbs, Image } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"

import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import restaurantsApi from "../../api/restaurantApi"
import { useSelector } from "react-redux"
import { setRestaurant } from "../../store/features/restaurantSlice"
import SettingsCard from "../../components/SettingsCard"
import toast from "react-hot-toast"
import authApi from "../../api/authApi"

export default function GeneralSettings() {
  const [restaurants, setRestaurants] = useState([])
  const restaurant = useSelector((state) => state.restaurant.value)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState({})
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        const response = await restaurantsApi.getAllRestaurants()

        if (response.error) {
          toast.error(`Fallo al obtener la información del restaurante. Por favor intente de nuevo. ${response.message}`, {
            duration: 7000
          })
        } else {
          setRestaurants(response.data)
        }
      } catch (error) {
        dispatch(setError("Error fetching dishesCategories"))
        throw error
      }
    }
    fetchAllRestaurants()
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getUser()

        if (response.error) {
          toast.error("Error en la respuesta de la información del usuario")
        } else {
          setUserData(response.data.data)
          console.log(response, "us")
        }
      } catch (error) {
        toast.error("Error obteniendo información del usuario")
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (restaurants.length > 0) {
      setLoading(false)
      // si no hay store selecciona por defecto el primer restaurant
      if (Object.keys(restaurant).length === 0) {
        dispatch(setRestaurant(restaurants?.[0]))
        setSelectedItem(restaurants?.[0])
      } else {
        setSelectedItem(restaurant)
      }
    }
  }, [restaurants])
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
              <Image src={selectedItem?.images?.[0]?.location} h={50} w={150} fit="contain" />
              <div className="flex flex-col pl-3">
                <div className="text-sky-950 text-md font-bold leading-snug">{selectedItem.name}</div>
                <div className="text-sky-950 text-xs font-normal leading-tight">{selectedItem.socialReason}</div>
              </div>
            </div>
            <div className={"px-2 py-1 rounded-2xl justify-center items-center"} style={{ whiteSpace: "nowrap" }}>
              <div className="text-md">{selectedItem?.isActive ? "Habilitado" : "Deshabilitado"}</div>
            </div>
          </div>

          <div className="border-b border-b-light_selected_element" />

          <div className="flex flex-row justify-between items-center py-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Correo</span>
              <span>{selectedItem.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Teléfono</span>
              <span>{selectedItem.phoneNumber}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Dirección principal</span>
              <span>{selectedItem.billingAddress}</span>
            </div>
          </div>

          <div className="border-b border-b-light_selected_element flex flex-row items-center w-full" />

          <div className="flex flex-row justify-between items-center py-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">Razón social</span>
              <span>{selectedItem.socialReason}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">CAI</span>
              <span>{selectedItem.cai}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sky-950 font-semibold">RTN</span>
              <span>{selectedItem.rtn}</span>
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

        <SettingsCard title="Plan" iconName="creditCard" linkPage={SETTING_NAVIGATION_ROUTES.Plan.path}></SettingsCard>
      </div>
    </BaseLayout>
  )
}

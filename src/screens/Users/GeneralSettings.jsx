import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Image } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { Icon } from "../../components/Icon"
import { Link } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import restaurantsApi from "../../api/restaurantApi"
import { useSelector } from "react-redux"
import { setRestaurant } from "../../store/features/restaurantSlice"

export default function GeneralSettings() {
  const [restaurants, setRestaurants] = useState([])
  const restaurant = useSelector((state) => state.restaurant.value)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState({})

  useEffect(() => {
    const fetchAllRestaurants = async () => {
      try {
        const response = await restaurantsApi.getAllRestaurants()

        if (response.error) {
          toast.error(`Fallo al obtener todos los platillos. Por favor intente de nuevo. ${response.message}`, {
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
    if (restaurants.length > 0) {
      setLoading(false)
      // si no hay store selecciona por defecto el primer restaurant
      if (Object.keys(restaurant).length === 0) {
        dispatch(setRestaurant(restaurants?.[0]))
        setSelectedItem(restaurants?.[0])
      } else {
        setSelectedItem(restaurant)
      }
      console.log(selectedItem)
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
        <section className="bg-white rounded-lg border border-blue-100 pb-5">
          <div className="w-full p-3 bg-[#f5f9ff] rounded-lg border border-blue-100 items-center justify-between flex flex-row">
            <div className="flex flex-row gap-2 items-center">
              <Icon icon="building" size={17} />
              <div className="text-sky-950 text-base font-bold leading-normal">Negocio</div>
            </div>
            <Link to={SETTING_NAVIGATION_ROUTES.Business_btn.path}>
              <Icon icon="arrowRight" size={17} />
            </Link>
          </div>
          <div className="flex flex-row items-center py-4 px-20 justify-between">
            <div className="flex flex-row items-center">
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
          <div className="flex flex-row px-20">
            <div className="border-b border-b-light_selected_element flex flex-row items-center w-full" />
          </div>
        </section>
      </div>
    </BaseLayout>
  )
}

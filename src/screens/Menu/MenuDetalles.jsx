import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Card, Grid, Image } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useLocation, useParams } from "react-router-dom"
import menuApi from "../../api/menuApi"
import toast from "react-hot-toast"
import { IconCamera } from "@tabler/icons-react"

export default function MenuDetalles() {
  const { menuId } = useParams()
  const location = useLocation()
  const [menuDetails, setMenuDetails] = useState({})

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuApi.getMenuByRestaurant(menuId)

        const menuDetails = response?.data
        setMenuDetails(menuDetails)
      } catch (error) {
        toast.error("Hubo un error obteniendo los detalles del menu")
        throw error
      }
    }
    fetchMenu()
  }, [])

  const dashboardCards = [
    {
      icon: "money",
      amount: 3500212.0,
      label: "Ventas totales",
      percentage: 0.43
    },
    {
      icon: "money",
      amount: 500212.0,
      label: "Ingresos totales",
      percentage: 2.59
    },
    {
      icon: "bag",
      amount: 1000,
      label: "Pedidos totales",
      percentage: 4.43
    },
    {
      icon: "search",
      amount: 3456,
      label: "Búsqueda totales",
      percentage: -0.95
    }
  ]

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <div className="flex flex-row gap-x-3 items-center">
            <h1 className="text-white-200 text-2xl font-semibold">{menuDetails?.name}</h1>
          </div>
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={menuId?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
        <section className="w-full xl:w-9/12 2xl:w-10/12 border border-blue-100 rounded-lg ">
          <Card padding="lg" radius="md">
            <Card.Section>
              <div className="relative">
                <img
                  className="w-full h-60 object-cover"
                  src="https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                />
              </div>
            </Card.Section>
            <section className="px-20">
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <div className="flex w-full flex-col ">
                    <h1 className="h-full w-full pt-12  text-2xl font-semibold">Hamburger</h1>
                    <div className="flex w-full flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm font-medium pt-4">
                        {menuDetails?.description || "Sin descripción disponible"}
                      </p>
                      <a
                        className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                        onClick={() => {
                          openFormModal()
                        }}>
                        Editar
                      </a>
                    </div>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20">
              <div className="pt-8">
                <span className="text-sky-950 text-base font-bold  leading-normal">Platillos </span>
                <span className="text-sky-950 text-base font-normal leading-normal">( 12 )</span>
                {menuDetails?.Dishes?.map((item) => (
                  <div
                    className="w-full p-5 my-3 bg-white rounded-lg border border-blue-100 flex-row justify-between items-center flex text-sm"
                    key={item?.id}>
                    <div className="flex flex-row items-center w-1/2">
                      <img className="w-10 h-10" src={item?.images?.[0]?.location} />
                      <span className="text-sky-950 pl-3">{item?.name}</span>
                    </div>
                    <div className="flex flex-row w-1/2 justify-end">
                      <span className="text-sky-950 pl-3">{getFormattedHNL(item?.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </Card>
        </section>
      </div>
    </BaseLayout>
  )
}

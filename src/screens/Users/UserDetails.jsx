import { useDisclosure } from "@mantine/hooks"
import React, { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Card, Grid, Image, Modal } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"

import { IconCamera } from "@tabler/icons-react"
import BackButton from "../Dishes/components/BackButton"
import { useSelector } from "react-redux"
import authApi from "../../api/authApi"
import { EditUserScreen } from "./EditUserScreen"
import { APP_ROLES } from "../../utils/constants"
import Button from "../../components/Button"
import driverApi from "../../api/driverApi"
import toast from "react-hot-toast"
import { NAVIGATION_ROUTES_RES_ADMIN } from "../../routes"

export default function UserDetails() {
  const { userId } = useParams()
  const user = useSelector((state) => state.user.value.role)
  const navigate = useNavigate()

  const location = useLocation()
  const restaurant = useSelector((state) => state.restaurants.restaurants)

  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)
  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)

  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await authApi.getUserDetails(userId)
        const userDetailsData = response?.data
        setUserDetails(userDetailsData)
      } catch (error) {
        toast.error("Hubo un error obteniendo los detalles del usuario")
        throw error
      }
    }
    fetchDetails()
  }, [closeFormModal, formModalOpened])

  const changeDriverStatus = async () => {
    try {
      const response = await driverApi.changeDriverStatus(userDetails?.Driver?.driverId)
      if (response?.status === "success") {
        toast.success("Estado actualizado!")

        navigate(NAVIGATION_ROUTES_RES_ADMIN.Users.path)
      } else {
        toast.error(`Hubo un error actualizando el estado. ${response.message}`)
      }
    } catch (error) {
      toast.error("Hubo un error, intente nuevamente.", error)
      throw error
    }
  }

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={userDetails?.name} />
          <div>
            <Breadcrumbs>
              <BreadCrumbNavigation location={location} dynamicRoute={userDetails?.name} />
            </Breadcrumbs>
          </div>
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2 xl:flex-nowrap">
        <section className="w-full xl:w-9/12 2xl:w-10/12 border border-blue-100 rounded-lg">
          <Card padding="lg" radius="md">
            <Card.Section>
              <div className="relative">
                <Image
                  src={restaurant?.bannerDishes?.[0]?.location}
                  h={"240px"}
                  w={"100%"}
                  fit="cover"
                  fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                />
                <img
                  className="w-44 h-44 rounded-full object-contain absolute border top-[150px] left-[50px] bg-white"
                  src={userDetails?.images?.[0]?.location}
                />
                <div
                  className="w-[34px] h-[34px] bg-sky-950 rounded-full absolute top-[280px] left-[190px] flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    openImageModal()
                  }}>
                  <IconCamera color="white" size={18} />
                </div>
              </div>
            </Card.Section>
            <section className="">
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <div className="p-5 bg-white flex md:items-center lg:items-start flex-col w-full">
                    <div className="flex justify-between items-center  w-full pt-20 pb-5">
                      <span className="text-sky-950 font-bold  text-left text-2xl">{userDetails?.name}</span>
                      {user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? (
                        <a
                          className="text-blue-600 text-base font-normal leading-normal cursor-pointer"
                          onClick={() => {
                            openFormModal()
                          }}>
                          Editar
                        </a>
                      ) : null}
                    </div>
                    <div className="text-sky-950 text-sm font-medium pb-5 leading-snug">{userDetails?.role}</div>
                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Correo</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">{userDetails?.email}</div>

                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Numero de teléfono</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">
                      {userDetails?.phoneNumber || "No disponible"}
                    </div>
                    <div className="text-sky-950 text-sm font-medium py-2 leading-snug">Estado</div>
                    <div className="text-sky-950 text-sm font-bold leading-snug pb-2">
                      {userDetails?.Driver?.active ? `Activo` : `No activo`}
                    </div>
                    {userDetails?.role === "driver" ? (
                      <Button
                        text={userDetails?.Driver?.active ? `Desactivar` : `Activar`}
                        className={`${userDetails?.Driver?.active ? "border-red-400 text-red-400" : "border-green-400 text-green-400"} text-md font-bold border bg-white`}
                        onClick={changeDriverStatus}
                      />
                    ) : null}

                    <div className="w-[125px] h-px bg-blue-100 sm:w-full" />
                  </div>
                </Grid.Col>
                <Grid.Col span={{ base: 12 }}></Grid.Col>
              </Grid>
            </section>
          </Card>
        </section>
        <section>
          <Modal
            opened={imageModalOpened}
            onClose={closeImageModal}
            centered
            size={"xl"}
            radius={"lg"}
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3
            }}>
            <Image
              h={"auto"}
              w="full"
              fit="contain"
              src={userDetails?.images?.[0]?.location}
              radius={"xl"}
              fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
            />
          </Modal>

          <Modal
            opened={formModalOpened}
            onClose={closeFormModal}
            centered
            size={"2xl"}
            radius={"lg"}
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3
            }}>
            <EditUserScreen userId={userId} close={closeFormModal} itemDetails={userDetails} />
          </Modal>
        </section>
      </div>
    </BaseLayout>
  )
}

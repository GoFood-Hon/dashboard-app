import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, Grid, Image, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import BackButton from "../Dishes/components/BackButton"
import authApi from "../../api/authApi"
import { formatDateDistanceToNow } from "../../utils"
import { EditAdminUser } from "./EditAdminUser"
import { useSelector } from "react-redux"
import { APP_ROLES } from "../../utils/constants"
import { SelectPlan } from "./SelectPlan"

export const AdminUserDetails = () => {
  const { adminId } = useParams()
  const user = useSelector((state) => state.user.value)
  const [userDetails, setUserDetails] = useState({})
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)

  useEffect(() => {
    ;(async () => {
      const response = await authApi.getUserDetails(adminId)

      const details = response?.data
      setUserDetails(details)
    })()
  }, [])

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-6">
          <BackButton title={userDetails?.name} />
        </div>
      </section>
      <div className="flex flex-row w-full flex-wrap gap-2">
        <section className="w-full border border-blue-100 rounded-lg">
          <Card padding="lg" radius="md">
            <Card.Section>
              <div className="relative">
                <Image
                  src={userDetails?.images?.[0]?.location}
                  h={"240px"}
                  w={"100%"}
                  fit="contain"
                  fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
                />
              </div>
            </Card.Section>
            <section className="px-20">
              <Grid>
                <Grid.Col span={{ base: 12 }}>
                  <div className="flex w-full flex-col ">
                    <h1 className="h-full w-full pt-12  text-2xl font-semibold">{userDetails?.name}</h1>
                    <div className="flex w-full flex-row justify-between items-center">
                      <p className="text-zinc-500 text-sm font-medium pt-4">
                        {userDetails?.billingAddress || "Sin dirección disponible"}
                      </p>
                      {user.role !== APP_ROLES.branchAdmin && user.role !== APP_ROLES.cashierUser ? (
                        <a
                          className="text-blue-600 text-base font-normal leading-normal cursor-pointer self-center"
                          onClick={() => {
                            openFormModal()
                          }}>
                          Editar
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Grid.Col>
              </Grid>
            </section>
            <section className="px-20">
              <div className="pt-8">
                <span className="text-sky-950 text-base font-bold leading-normal">Numero de teléfono</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{userDetails?.phoneNumber}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Restaurante seleccionado</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{userDetails?.restaurantName}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Plan seleccionado</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{userDetails?.planName || "Sin plan asignado"}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Email </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{userDetails?.email}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Ultima actualización </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{formatDateDistanceToNow(userDetails?.updatedAt)}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Estado </span>
                <p className="text-zinc-500 text-sm font-medium py-2">{userDetails?.active ? "Habilitado" : "Deshabilitado"}</p>
                <span className="text-sky-950 text-base font-bold leading-normal">Ultimo inicio de sesión</span>
                <p className="text-zinc-500 text-sm font-medium py-2">{formatDateDistanceToNow(userDetails?.lastLogin)}</p>
              </div>
            </section>
          </Card>
        </section>
        <SelectPlan restaurantId={userDetails?.restaurantId} />
      </div>
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
        <EditAdminUser close={closeFormModal} details={userDetails} adminId={adminId} />
      </Modal>
    </>
  )
}

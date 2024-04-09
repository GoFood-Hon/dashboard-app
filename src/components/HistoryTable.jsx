import { Grid, Image, Modal } from "@mantine/core"
import React from "react"
import { formatDateDistanceToNow, formatDateToString } from "../utils"
import { Icon } from "./Icon"
import { useDisclosure } from "@mantine/hooks"
import { EditOfferForm } from "./EditOfferForm"
import couponApi from "../api/couponApi"
import toast from "react-hot-toast"
import promotionApi from "../api/promotionApi"

export const HistoryTable = ({ item, section }) => {
  const [imageModalOpened, { open: openImageModal, close: closeImageModal }] = useDisclosure(false)
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] = useDisclosure(false)

  const toggleAvailability = async () => {
    try {
      const formData = new FormData()
      formData.append("isActive", !item.isActive)

      let response
      if (section === "Cupones") {
        response = await couponApi.updateStatus(item.id, formData)
      } else {
        response = await promotionApi.updateStatus(item.id, formData)
      }

      if (response.status === "success") {
        toast.success(`Cupón ${response.isActive ? "activado" : "desactivado"} exitosamente`)
        window.location.reload()
      } else {
        toast.error(`Fallo al cambiar el estado del cupón. Por favor intente de nuevo. ${response.message}`)
      }
    } catch (error) {
      toast.error(`Error al cambiar el estado del cupón. Por favor intente de nuevo. ${error}`)
    }
  }

  return (
    <Grid my={20} grow justify="space-between" align="center">
      <Grid.Col span={{ sm: 5 }}>
        <div className="flex flex-col">
          <div className="cursor-pointer border-2 w-fit h-fit radius-md rounded-md border-sky-100">
            <Image
              h={70}
              w={70}
              radius="md"
              fit="contain"
              src={item?.images?.[0]?.location}
              fallbackSrc="https://placehold.co/60x40?text=Imagen+no+disponible"
              onClick={() => {
                openImageModal()
              }}
            />
          </div>

          <span className="font-bold text-xl text-blue-950">{item?.title}</span>
          <span className="font-bold text-xs text-gray-500 my-2 italic">ID: {item?.id}</span>
          <div className="flex flex-row gap-3 text-gray-500">
            {item.couponType === "fecha" || (item.startDate && item.endDate) ? (
              <>
                <div className="flex flex-row items-center">
                  <Icon icon="calendar" size={17} />
                  <span className="pl-2">{formatDateToString(item.startDate)}</span>
                </div>
                <div className="flex flex-row items-center">
                  <Icon icon="calendar" size={17} />
                  <span className="pl-2">{formatDateToString(item.endDate)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row items-center pb-3">
                  <span>Cantidad de usos:</span>
                  <span>{item.timesToUse}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 2 }}>
        <div className="flex flex-row items-center text-gray-600">
          <Icon icon="timer" size={17} />
          <span className="pl-2">{formatDateDistanceToNow(item?.updatedAt)}</span>
        </div>
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 3 }}>
        <button
          className={`flex gap-2 px-2 py-2 rounded-full flex-row items-end justify-center text-md font-semibold ${
            item.isActive ? "text-green-600 bg-green-100" : "bg-red-100 text-red-600"
          }`}
          onClick={toggleAvailability}>
          <span>Cupón</span>
          <span>{item.isActive ? "Activo" : "Inactivo"}</span>
        </button>
      </Grid.Col>
      <Grid.Col span={{ sm: 12, md: 2 }}>
        <div className="flex gap-2 items-center justify-center font-bold cursor-pointer">
          <span
            onClick={() => {
              openFormModal()
            }}>
            Ver detalles
          </span>
        </div>
      </Grid.Col>
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
          src={item?.images?.[0]?.location}
          radius={"xl"}
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
        />
      </Modal>
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        centered
        padding={"xl"}
        size={"xl"}
        radius={"lg"}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <EditOfferForm section={section} item={item} />
      </Modal>
    </Grid>
  )
}

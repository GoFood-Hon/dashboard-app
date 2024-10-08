import React, { useEffect, useState } from "react"
import { Checkbox, CloseIcon, Grid, Group, Paper, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import { bytesToMB } from "../../utils"
import { fetchDishesCategories, selectAllDishesCategoriesStatus } from "../../store/features/categorySlice"
import { colors } from "../../theme/colors"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared, itemDetails, image }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const status = useSelector(selectAllDishesCategoriesStatus)

  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const [isDelivery, setIsDelivery] = useState(itemDetails?.delivery ?? false)
  const [isPickUp, setIsPickUp] = useState(itemDetails?.pickup ?? false)
  const [isOnSite, setIsOnSite] = useState(itemDetails?.onSite ?? false)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  useEffect(() => {
    if (isDataCleared) {
      deleteImage()
    }
  }, [isDataCleared])

  useEffect(() => {
    if (status === "succeeded" || status === "idle") {
      dispatch(fetchDishesCategories(user.restaurantId))
    }
  }, [])

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return (
      <img
        key={index}
        src={imageUrl}
        onLoad={() => URL.revokeObjectURL(imageUrl)}
        className="h-14 w-14 rounded-xl object-cover object-center border m-1"
      />
    )
  })

  const handleHasDelivery = () => {
    setIsDelivery((prevState) => {
      const newValue = !prevState
      setValue("delivery", newValue)
      return newValue
    })
  }

  const handleHasPickUp = () => {
    setIsPickUp((prevState) => {
      const newValue = !prevState
      setValue("pickup", newValue)
      return newValue
    })
  }

  const handleHasOnSite = () => {
    setIsOnSite((prevState) => {
      const newValue = !prevState
      setValue("onSite", newValue)
      return newValue
    })
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="w-full h-full items-center justify-center flex  rounded-2xl p-4">
          <div className="flex flex-col w-full">
            <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors}  />
            <div className="flex flex-row w-full justify-end flex-wrap">
              <div className="w-1/2 pr-2">
                <InputField
                  label="Correo (Obligatorio)"
                  name="email"
                  register={register}
                  errors={errors}
                  className="text-black"
                />
              </div>
              <div className="w-1/2 pl-2">
                <InputField
                  label="Teléfono (Obligatorio)"
                  name="phoneNumber"
                  register={register}
                  errors={errors}
                  className="text-black"
                />
              </div>
            </div>
            <InputTextAreaField label="Nota" name="note" register={register} errors={errors} />
            <Checkbox
              mt={"md"}
              labelPosition="left"
              label={<div className="text-sm font-bold leading-snug">¿Cuenta con delivery?</div>}
              name="delivery"
              color={colors.main_app_color}
              checked={isDelivery}
              size="sm"
              onChange={handleHasDelivery}
            />
            <Checkbox
              mt={"md"}
              labelPosition="left"
              label={<div className="text-sm font-bold leading-snug">¿Cuenta con retiro en restaurante?</div>}
              color={colors.main_app_color}
              checked={isPickUp}
              size="sm"
              onChange={handleHasPickUp}
            />
            <Checkbox
              mt={"md"}
              labelPosition="left"
              label={
                <div className="text-sm font-bold leading-snug">
                  ¿Cuenta con disponibilidad para comer en el restaurante?
                </div>
              }
              color={colors.main_app_color}
              checked={isOnSite}
              size="sm"
              onChange={handleHasOnSite}
            />
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <Paper withBorder radius='md' className="flex flex-col justify-center items-center w-full h-full rounded-2xl p-4">
          {previews.length > 0 ? (
            <div className="w-full">
              <Text size="lg" inline className="text-left mb-5">
                Imagen seleccionada:
              </Text>
              <div className="flex flex-row justify-center items-center rounded-2xl w-full border border-slate-200 my-3">
                <div className="flex flex-row w-full items-center gap-2 flex-wrap p-2">
                  {previews}
                  <div className="flex flex-col">
                    <Text className="font-semibold italic">{fileInformation?.name}</Text>
                    <Text className="font-semibold" size="sm" c="dimmed" inline>
                      {bytesToMB(fileInformation?.size)} MB
                    </Text>
                  </div>
                </div>
                <button onClick={deleteImage} className="pr-3">
                  <CloseIcon size={24} />
                </button>
              </div>
            </div>
          ) : (
            <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE}>
              <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                <div className="flex items-center flex-col">
                  <img className="rounded-xl cursor-pointer" src={image} alt="" />
                  <IconPhoto
                    className={`${image ? "hidden" : ""}`}
                    style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                    stroke={1.5}
                  />
                  <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                    Seleccione una imagen
                  </Text>
                  <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
                    Haga clic o arrastre la imagen del usuario
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

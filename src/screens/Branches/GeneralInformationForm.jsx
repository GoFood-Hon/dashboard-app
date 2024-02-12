import React, { useEffect, useState } from "react"
import { Checkbox, CloseIcon, Grid, Group, Text, rem } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import { bytesToMB } from "../../utils"
import { fetchDishesCategories, selectAllDishesCategoriesStatus } from "../../store/features/categorySlice"
import { colors } from "../../theme/colors"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)

  const status = useSelector(selectAllDishesCategoriesStatus)

  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const [isDelivery, setIsDelivery] = useState(false)
  const [isPickUp, setIsPickUp] = useState(false)
  const [isOnSite, setIsOnSite] = useState(false)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
      toast.success("Archivos aceptados 👍", { duration: 7000 })
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
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex flex-col w-full">
            <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} className="text-black" />
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
              label={<div className="text-sky-950 text-sm font-bold leading-snug">¿Cuenta con delivery?</div>}
              color={colors.primary_button}
              checked={isDelivery}
              size="sm"
              onChange={handleHasDelivery}
            />
            <Checkbox
              mt={"md"}
              labelPosition="left"
              label={<div className="text-sky-950 text-sm font-bold leading-snug">¿Cuenta con retiro en restaurante?</div>}
              color={colors.primary_button}
              checked={isPickUp}
              size="sm"
              onChange={handleHasPickUp}
            />
            <Checkbox
              mt={"md"}
              labelPosition="left"
              label={
                <div className="text-sky-950 text-sm font-bold leading-snug">
                  ¿Cuenta con disponibilidad para comer en el restaurante?
                </div>
              }
              color={colors.primary_button}
              checked={isOnSite}
              size="sm"
              onChange={handleHasOnSite}
            />
          </div>
        </div>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <div className="flex flex-col justify-center items-center w-full h-full bg-white rounded-2xl border border-blue-100 p-4">
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
                  <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
                  <Text size="xl" inline className="text-center">
                    Seleccione una imagen destacada
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-10">
                    Haga click o arrastre una imagen que sera usada junto con la sucursal
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </div>
      </Grid.Col>
    </Grid>
  )
}

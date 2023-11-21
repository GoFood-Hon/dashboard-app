import { CloseIcon, Grid, Group, Image, SimpleGrid, Text, rem, InputBase, Combobox, useCombobox } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import React, { useEffect, useState } from "react"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import toast from "react-hot-toast"
import { bytesToMB } from "../../utils"
import { useDispatch, useSelector } from "react-redux"
import { fetchDishesCategories, selectAllDishesCategoriesStatus } from "../../store/features/categorySlice"
import InputCombobox from "../../components/Form/InputCombobox"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared }) {
  const dispatch = useDispatch()
  const restaurant = useSelector((state) => state.restaurant.value)

  const complementsType = [
    {
      value: "Complemento",
      label: "Complemento"
    },
    {
      value: "Bebidas",
      label: "Bebidas"
    },
    {
      value: "Postres",
      label: "Postres"
    },
    {
      value: "Extras",
      label: "Extras"
    }
  ]
  const status = useSelector(selectAllDishesCategoriesStatus)

  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

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
      dispatch(fetchDishesCategories(restaurant.id))
    }
  }, [restaurant])

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

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <div className="w-full h-full items-center justify-center flex bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex flex-col w-full">
            <InputField
              label="Nombre (Obligatorio)"
              name="name"
              register={register}
              errors={errors}
              placeholder="Ej. Salsa especial"
              className="text-black"
            />

            <InputTextAreaField
              label="Descripción (Obligatorio)"
              name="description"
              register={register}
              errors={errors}
              placeholder="Ej. Salsa especial de la casa..."
            />
            <div className="mt-3">
              <InputCombobox
                items={complementsType}
                placeholder="Seleccione la categoría"
                setValue={setValue}
                errors={errors}
                label="Tipo de complemento"
                name="category"
              />
            </div>
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
                  <Text size="sm" c="dimmed" inline mt={7} className="text-center leading-relaxed">
                    Haga click o arrastre una imagen para el complemento
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

import React, { useEffect, useState } from "react"
import { Grid, Paper, Text, rem, Image, Flex, Select } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { useDispatch } from "react-redux"
import { setCollectionType } from "../../store/features/collectionsSlice"
import { useSelector } from "react-redux"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared, image, control, edit }) {
  const [images, setImages] = useState([])
  const collectionType = useSelector((state) => state.collections.collectionType)
  const dispatch = useDispatch()

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  useEffect(() => {
    setValue("type", "dishes")
  }, [])

  const handleCollectionType = (value) => {
    setValue("type", value === "Platillos" ? "dishes" : "restaurants")
    dispatch(setCollectionType(value === "Platillos" ? "dishes" : "restaurants"))
  }

  const previews = images.map((file) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image radius="md" h={220} src={imageUrl} />
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" className="w-full h-full items-center justify-center flex rounded-2xl p-4">
          <div className="flex flex-col w-full justify-evenly h-full">
            <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
            <InputTextAreaField label="Descripción (Obligatorio)" name="description" register={register} errors={errors} />
            <Select
              disabled={edit}
              name="type"
              label="Contenido de la colección"
              data={["Restaurantes", "Platillos"]}
              defaultValue={"Platillos"}
              value={collectionType === "dishes" ? "Platillos" : "Restaurantes"}
              allowDeselect={false}
              maxDropdownHeight={200}
              onChange={handleCollectionType}
            />
          </div>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <Paper withBorder radius="md" h="100%">
          <Flex align="center" h="100%" justify="center">
            <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE} h={220} style={{ cursor: "pointer" }}>
              <Flex direction="column" justify="center" align="center" h={220}>
                {previews.length > 0 ? (
                  previews
                ) : (
                  <>
                    <Image radius="md" h={220} src={image} />
                    <IconPhoto
                      className={`${image ? "hidden" : ""}`}
                      style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                      stroke={1.5}
                    />
                    <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                      Seleccione una imagen
                    </Text>
                    <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
                      Haga clic o arrastre la imagen del menú
                    </Text>
                  </>
                )}
              </Flex>
            </Dropzone>
          </Flex>
          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

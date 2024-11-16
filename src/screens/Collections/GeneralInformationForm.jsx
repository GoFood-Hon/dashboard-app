import React, { useEffect, useState } from "react"
import { CloseIcon, Grid, Group, Paper, Text, rem, Image, Container, Flex, Select } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { colors } from "../../theme/colors"
import { bytesToMB } from "../../utils"
import { menuType } from "../../utils/constants"
import { useDispatch } from "react-redux"
import { setCollectionType } from "../../store/features/collectionsSlice"
import { useSelector } from "react-redux"

export default function GeneralInformationForm({ register, errors, setValue, isDataCleared, image, control }) {
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)
  const collectionType = useSelector((state) => state.collections.collectionType)
  const dispatch = useDispatch()

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
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

  const deleteImage = () => {
    setFileInformation(null)
    setImages([])
  }

  useEffect(() => {
    if (isDataCleared) {
      deleteImage()
    }
  }, [isDataCleared])

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
        <Paper withBorder className="w-full h-full items-center justify-center flex rounded-2xl p-4">
          <div className="flex flex-col w-full justify-evenly h-full">
            <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
            <InputTextAreaField label="Descripción (Obligatorio)" name="description" register={register} errors={errors} />
            <Select
              name="type"
              label="Contenido de la colección"
              data={["Restaurantes", "Platillos"]}
              defaultValue={collectionType === "dishes" ? "Platillos" : "Restaurantes"}
              allowDeselect={false}
              maxDropdownHeight={200}
              onChange={handleCollectionType}
            />
          </div>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
        <Paper withBorder radius="md" className="flex flex-col justify-center items-center w-full h-full  rounded-2xl p-4">
          {previews.length > 0 ? (
            <div className="w-full">
              <Text size="lg" inline className="text-left mb-5">
                Imagen seleccionada:
              </Text>
              <div className="flex flex-row justify-center items-center rounded-2xl w-full my-3">
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
                <Container maw={280}>
                  <Flex direction="column" align="center">
                    <Image src={image} alt="" style={{ cursor: "pointer" }} radius="md" />
                    <IconPhoto
                      className={`${image ? "hidden" : ""}`}
                      style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                      stroke={1.5}
                    />
                    <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                      Seleccione una imagen
                    </Text>
                    <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
                      Haga clic o arrastre la imagen de la colección
                    </Text>
                  </Flex>
                </Container>
              </Group>
            </Dropzone>
          )}
          {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

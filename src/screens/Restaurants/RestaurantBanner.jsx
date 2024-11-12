import React, { useEffect, useState } from "react"
import { Checkbox, CloseIcon, Container, Flex, Grid, Group, Paper, Text, rem, Image, Select } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { bytesToMB } from "../../utils"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllKitchenTypes } from "../../store/features/kitchenAndTagsSlice"

export const RestaurantBanner = ({ register, control, errors, setValue, isDataCleared, image, watch }) => {
  const dispatch = useDispatch()
  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  useEffect(() => {
    dispatch(fetchAllKitchenTypes())
  }, [dispatch])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("bannerDishes", acceptedFiles)
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
    <Paper withBorder radius="md">
      <Flex align="center" justify="center">
        {previews.length > 0 ? (
          <Container h={220} maw={400}>
            <Flex direction='column' justify='center' align='center' h={220}>
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
            </Flex>
          </Container>
        ) : (
          <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE} h={220}>
            <Group justify="center" gap="xl" align="center" style={{ pointerEvents: "none" }}>
              <Container maw={400}>
                <Flex direction="column" justify="center" align="center" h={220}>
                  <Image src={image} radius="md" alt="" style={{ cursor: "pointer" }} />
                  <IconPhoto
                    className={`${image ? "hidden" : ""}`}
                    style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                    stroke={1.5}
                  />
                  <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                    Seleccione una imagen
                  </Text>
                  <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
                    Haga clic o arrastre la imagen del restaurante
                  </Text>
                </Flex>
              </Container>
            </Group>
          </Dropzone>
        )}
      </Flex>
      {errors.files && <p className="text-red-500 text-center w-full">* Imagen es requerida.</p>}
    </Paper>
  )
}

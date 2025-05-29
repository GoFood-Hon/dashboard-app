import React, { useEffect, useState } from "react"
import { Checkbox, CloseIcon, Container, Flex, Grid, Group, Paper, Text, rem, Image, Select } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { IconPhoto } from "@tabler/icons-react"
import { bytesToMB } from "../../utils"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllKitchenTypes } from "../../store/features/kitchenAndTagsSlice"
import { colors } from "../../theme/colors"

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
    return <Image radius="md" h={250} src={imageUrl} />
  })

  return (
    <Paper withBorder radius="md" p="xs">
      <Flex align="center" justify="center">
        <Dropzone onDrop={handleDrop} accept={IMAGE_MIME_TYPE} h={250} style={{ cursor: "pointer" }}>
          <Flex direction="column" justify="center" align="center" h={250}>
            {previews.length > 0 ? (
              previews
            ) : (
              <>
                <Image radius="md" h={250} src={image} />
                <IconPhoto
                  className={`${image ? "hidden" : ""}`}
                  style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
                  stroke={1.5}
                />
                <Text className={`${image ? "hidden" : ""} text-center`} size="xl" inline>
                  Seleccione una imagen
                </Text>
                <Text className={`${image ? "hidden" : ""} text-center leading-10`} size="sm" c="dimmed" inline mt={7}>
                  Haga clic o arrastre el banner del comercio
                </Text>
                {errors.files && (
                  <Text c={colors.main_app_color} size="xs" ta="center">
                    Banner es requerido
                  </Text>
                )}
              </>
            )}
          </Flex>
        </Dropzone>
      </Flex>
    </Paper>
  )
}

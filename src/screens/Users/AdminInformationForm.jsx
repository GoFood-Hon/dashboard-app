import { Flex, Grid, Image, Paper, Text, rem } from "@mantine/core"
import React, { useEffect, useState } from "react"
import InputField from "../../components/Form/InputField"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { colors } from "../../theme/colors"
import { IconPhoto } from "@tabler/icons-react"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { fetchNoPaginatedRestaurants } from "../../store/features/restaurantSlice"

export const AdminInformationForm = ({ register, errors, setValue, image }) => {
  const dispatch = useDispatch()
  const {loadingRestaurants, restaurants} = useSelector((state) => state.restaurants)

  useEffect(() => {
    dispatch(fetchNoPaginatedRestaurants())
  }, [dispatch])

  const [images, setImages] = useState([])
  const [fileInformation, setFileInformation] = useState(null)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const [file] = acceptedFiles
      setFileInformation(file)
      setImages(acceptedFiles)
      setValue("files", acceptedFiles)
    }
  }

  const previews = images.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image radius="md" h={250} src={imageUrl} />
  })

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Email" name="email" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <InputField
                label="Numero de teléfono"
                name="phoneNumber"
                register={register}
                errors={errors}
                className="text-black"
                countryPrefix="+504"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Ingrese la contraseña"
                name="password"
                register={register}
                errors={errors}
                className="text-black"
                type="password"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Vuelva a ingresar la contraseña"
                name="passwordConfirm"
                register={register}
                errors={errors}
                className="text-black"
                type="password"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputSearchCombobox
                label="Asignar restaurante"
                name={"restaurantId"}
                emptyMessage="No se encontró ningún restaurante"
                items={restaurants}
                status={loadingRestaurants}
                register={register}
                errors={errors}
                setValue={setValue}
                color={colors.primary_button}
              />
            </Grid.Col>
          </Grid>
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

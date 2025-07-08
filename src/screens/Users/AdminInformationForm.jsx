import { useEffect } from "react"
import { Grid, Paper } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import InputSearchCombobox from "../../components/Form/InputSearchCombobox"
import { colors } from "../../theme/colors"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { fetchNoPaginatedRestaurants } from "../../store/features/restaurantSlice"
import { ImageDropzone } from "../../components/ImageDropzone"
import { useDisclosure } from "@mantine/hooks"

export const AdminInformationForm = ({ register, errors, setValue, image, watch }) => {
  const dispatch = useDispatch()
  const { loadingRestaurants, restaurants } = useSelector((state) => state.restaurants)
  const [visible, { toggle }] = useDisclosure(false)

  useEffect(() => {
    dispatch(fetchNoPaginatedRestaurants())
  }, [dispatch])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo" name="email" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <InputField
                label="Número de teléfono"
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
                type="password"
                visible={visible}
                onToggleVisibility={toggle}
                newPassword
                watch={watch}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Vuelva a ingresar la contraseña"
                name="passwordConfirm"
                register={register}
                errors={errors}
                type="password"
                visible={visible}
                onToggleVisibility={toggle}
                newPassword
                watch={watch}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputSearchCombobox
                label="Asignar comercio"
                name={"restaurantId"}
                emptyMessage="No se encontró ningún comercio"
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
        <ImageDropzone
          image={image}
          images={watch("files")}
          onDrop={handleDrop}
          error={errors?.files?.message}
          title="del usuario"
        />
      </Grid.Col>
    </Grid>
  )
}

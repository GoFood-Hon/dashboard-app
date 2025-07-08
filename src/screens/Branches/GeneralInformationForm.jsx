import { useEffect } from "react"
import { Grid, Group, Paper, Text } from "@mantine/core"
import { useDispatch, useSelector } from "react-redux"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import InputField from "../../components/Form/InputField"
import { fetchDishesCategories, selectAllDishesCategoriesStatus } from "../../store/features/categorySlice"
import { ImageDropzone } from "../../components/ImageDropzone"
import InputCheckbox from "../../components/Form/InputCheckbox"

export default function GeneralInformationForm({ register, errors, setValue, image, watch }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const status = useSelector(selectAllDishesCategoriesStatus)

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  useEffect(() => {
    if (status === "succeeded" || status === "idle") {
      dispatch(fetchDishesCategories(user.restaurantId))
    }
  }, [])

  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" h="100%" p={"md"}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo (Obligatorio)" name="email" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Teléfono (Obligatorio)" name="phoneNumber" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Rango de distancia de entrega en KM (Obligatorio)"
                name="maxDistanceShipping"
                register={register}
                errors={errors}
                type="number"
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputTextAreaField label="Nota (Opcional)" name="note" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <Text size="sm">
                Marca las opciones disponibles para esta sucursal:
              </Text>
              <Group>
                <InputCheckbox label="Servicio a domicilio" name="delivery" register={register} labelPosition="right" />
                <InputCheckbox label="Recoger en tienda" name="pickup" register={register} labelPosition="right" />
                <InputCheckbox label="Comer en sitio" name="onSite" register={register} labelPosition="right" />
                <InputCheckbox label="Permite reservaciones" name="allowTableBooking" register={register} labelPosition="right" />
              </Group>
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
          title="de la sucursal"
        />
      </Grid.Col>
    </Grid>
  )
}

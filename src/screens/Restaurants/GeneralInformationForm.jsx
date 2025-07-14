import { useEffect } from "react"
import { Grid, Paper, Select } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import { useDispatch, useSelector } from "react-redux"
import { Controller } from "react-hook-form"
import InputCheckbox from "../../components/Form/InputCheckbox"
import { fetchAllKitchenTypes } from "../../store/features/kitchenAndTagsSlice"
import { ImageDropzone } from "../../components/ImageDropzone"

export const GeneralInformationForm = ({ register, control, errors, setValue, image, watch, blocked }) => {
  const dispatch = useDispatch()
  const kitchenTypes = useSelector((state) => state.kitchenAndTags.kitchenTypes)

  const isFreeDelivery = watch("shippingFree", true)

  useEffect(() => {
    dispatch(fetchAllKitchenTypes())
  }, [dispatch])

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  return (
    <Grid>
      <Grid.Col order={{ base: 2, sm: 2, md: 2 }} span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs">
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Nombre del comercio (Obligatorio)" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Correo electrónico (Obligatorio)" name="email" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Teléfono (Obligatorio)"
                name="phoneNumber"
                countryPrefix="+504"
                register={register}
                errors={errors}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="Razón social (Obligatorio)" name="socialReason" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="RTN (Obligatorio)" name="rtn" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField label="CAI (Obligatorio)" name="cai" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <InputField
                label="Dirección de facturación (Obligatorio)"
                name="billingAddress"
                register={register}
                errors={errors}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Controller
                name="cuisineTypeId"
                control={control}
                render={({ field, fieldState }) => (
                  <Select
                    label="Tipo de establecimiento (Obligatorio)"
                    data={kitchenTypes?.map((item) => ({
                      value: item.id,
                      label: item.name
                    }))}
                    allowDeselect={false}
                    maxDropdownHeight={200}
                    value={field.value ?? ""}
                    onChange={(val) => field.onChange(val ?? "")}
                    error={fieldState.error ? fieldState.error.message : null}
                    searchable
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12 }}>
              <InputField
                label="Clinpays Token (Obligatorio)"
                name="clinpaysCommerceToken"
                register={register}
                errors={errors}
                disabled={blocked}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }} className="mt-4">
              <InputCheckbox label="¿Cuenta con envío gratis?" name="shippingFree" register={register} />
            </Grid.Col>

            {isFreeDelivery ? null : (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <InputField
                  label="Precio del envío por kilómetro (Obligatorio)"
                  name="shippingPrice"
                  register={register}
                  errors={errors}
                />
              </Grid.Col>
            )}
          </Grid>
        </Paper>
      </Grid.Col>
      <Grid.Col order={{ base: 1, sm: 1, md: 2 }} span={{ base: 12, md: 4, lg: 4 }}>
        <ImageDropzone
          image={image}
          images={watch("files")}
          onDrop={handleDrop}
          error={errors?.files?.message}
          title="del comercio"
        />
      </Grid.Col>
    </Grid>
  )
}

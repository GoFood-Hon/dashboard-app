import { Grid, Paper } from "@mantine/core"
import InputField from "../../components/Form/InputField"
import InputTextAreaField from "../../components/Form/InputTextAreaField"
import { ImageDropzone } from "../../components/ImageDropzone"

export default function GeneralInformationForm({ register, errors, setValue, image, watch }) {
  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setValue("files", acceptedFiles)
    }
  }

  return (
    <Grid align="stretch">
      <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
        <Paper withBorder radius="md" p="xs" h="100%">
          <Grid gutter="md" align="center">
            <Grid.Col span={12}>
              <InputField label="Nombre (Obligatorio)" name="name" register={register} errors={errors} />
            </Grid.Col>
            <Grid.Col span={12}>
              <InputTextAreaField label="Descripción (Obligatorio)" name="description" register={register} errors={errors} />
            </Grid.Col>
          </Grid>
        </Paper>
      </Grid.Col>

      <Grid.Col
        order={{ base: 1, sm: 1, md: 2 }}
        span={{ base: 12, md: 4, lg: 4 }}
        style={{ display: "flex", flexDirection: "column" }}>
        <ImageDropzone
          image={image}
          images={watch("files")}
          onDrop={handleDrop}
          error={errors?.files?.message}
          title="del menú"
        />
      </Grid.Col>
    </Grid>
  )
}

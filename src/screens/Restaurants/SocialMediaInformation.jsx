import { Grid } from "@mantine/core"
import InputField from "../../components/Form/InputField"

export const SocialMediaInformation = ({ register, errors }) => {
  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <InputField label="WhatsApp (Opcional)" type="number" name="whatsapp" register={register} errors={errors} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <InputField label="Facebook (Opcional)" type="text" name="facebook" register={register} errors={errors} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <InputField label="Instagram (Opcional)" type="text" name="instagram" register={register} errors={errors} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
        <InputField label="Sitio web (Opcional)" type="text" name="website" register={register} errors={errors} />
      </Grid.Col>
    </Grid>
  )
}

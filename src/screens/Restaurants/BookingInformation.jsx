import { Grid, Input } from "@mantine/core"
import InputField from "../../components/Form/InputField"

const BookingInformation = ({ register, errors }) => {
  return (
    <Grid grow>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <InputField label="Precio por silla" type="number" name="pricePerChair" register={register} errors={errors} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <InputField
          label="Horas de anticipo para reservación"
          type="number"
          name="hoursBeforeCancellation"
          register={register}
          errors={errors}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
        <InputField
          label="Horas antes de la reservación para pagarla"
          type="number"
          name="hoursBeforeBooking"
          register={register}
          errors={errors}
        />
      </Grid.Col>
    </Grid>
  )
}

export default BookingInformation

import { Grid } from "@mantine/core"
import React from "react"

import InputField from "../../components/Form/InputField"

export const AdminInformationForm = ({ register, errors, setValue }) => {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 mx-28">
      <Grid justify="center" align="center">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField label="Nombre" name="name" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField label="Email" name="email" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12 }}>
          <InputField label="Numero de teléfono" name="phoneNumber" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField label="Ingrese la contraseña" name="password" register={register} errors={errors} className="text-black" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <InputField
            label="Vuelva a ingresar la contraseña"
            name="passwordConfirm"
            register={register}
            errors={errors}
            className="text-black"
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}

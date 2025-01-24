import React from "react"
import InputField from "../../../components/Form/InputField"
import { useForm } from "react-hook-form"
import { emailRules } from "../../../utils/inputRules"
import { Button, Stack } from "@mantine/core"
import { colors } from "../../../theme/colors"

export default function EnterEmail({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <InputField
          label="Correo electrónico"
          name="email"
          register={register}
          rules={emailRules}
          errors={errors}
          placeholder="Ingrese su correo"
        />
        <Button type="submit" loading={isLoading} fullWidth color={colors.main_app_color}>
          Envíar correo
        </Button>
      </Stack>
    </form>
  )
}

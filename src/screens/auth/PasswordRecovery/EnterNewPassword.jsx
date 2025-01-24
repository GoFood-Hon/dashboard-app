import React from "react"
import InputField from "../../../components/Form/InputField"
import { yupResolver } from "@hookform/resolvers/yup"
import { passwordValidationSchema } from "../../../utils/inputRules"
import { useForm } from "react-hook-form"
import { Button, Stack, Text } from "@mantine/core"
import { colors } from "../../../theme/colors"

export default function EnterNewPassword({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(passwordValidationSchema)
  })

  return (
    <Stack>
      <Text size="sm" className="text-center">
        Por favor ingrese su nueva contraseña
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <InputField
            label="Nueva contraseña"
            name="password"
            type="password"
            register={register}
            errors={errors}
            placeholder="Ingrese su contraseña"
          />
          <InputField
            label="Confirmar contraseña"
            name="passwordConfirm"
            type="password"
            register={register}
            errors={errors}
            placeholder="Ingrese su contraseña nuevamente"
          />
          <Button type="submit" loading={isLoading} fullWidth color={colors.main_app_color}>
            Reestablecer contraseña
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

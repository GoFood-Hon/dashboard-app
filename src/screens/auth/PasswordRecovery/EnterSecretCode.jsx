import React from "react"
import InputField from "../../../components/Form/InputField"
import { inputRequired } from "../../../utils/inputRules"
import { useForm } from "react-hook-form"
import { Button, Stack, Text } from "@mantine/core"
import { colors } from "../../../theme/colors"

export default function EnterSecretCode({ onSubmit, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <Stack>
      <Text size="sm" className="text-center">
        Por favor ingrese el código enviado a su correo, válido por 10 minutos
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <InputField
            errors={errors}
            label="Código"
            rules={inputRequired}
            name="token"
            register={register}
            placeholder="Ingrese el código secreto"
          />
          <Button type="submit" loading={isLoading} fullWidth color={colors.main_app_color}>
            Validar código
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

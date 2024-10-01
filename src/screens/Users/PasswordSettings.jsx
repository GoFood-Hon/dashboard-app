import React from "react"
import { Grid } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import Button from "../../components/Button"
import { SETTING_NAVIGATION_ROUTES } from "../../routes"
import { yupResolver } from "@hookform/resolvers/yup"
import { resetPasswordValidation } from "../../utils/inputRules"
import toast from "react-hot-toast"
import authApi from "../../api/authApi"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { APP_ROLES } from "../../utils/constants"
import BackButton from "../Dishes/components/BackButton"

export default function PasswordSettings() {
  const user = useSelector((state) => state.user.value)

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordValidation)
  })

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append("currentPassword", data.currentPassword)
      formData.append("newPassword", data.newPassword)
      formData.append("newPasswordConfirm", data.newPasswordConfirm)

      const response = await authApi.changePassword(formData)

      if (response.error) {
        toast.error(`Fallo al actualizar la contraseña. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        toast.success("Contraseña actualizada exitosamente", {
          duration: 7000
        })
        window.location.reload()
      }
    } catch (error) {
      toast.error("Error restableciendo su contraseña", error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${user.role === APP_ROLES.restaurantAdmin && "pl-[130px]"}`}>
          <section>
            <div className="flex flex-row justify-between items-center pb-3">
              <div className="flex flex-row gap-x-3 items-center">
                <BackButton title="Contraseña" />
              </div>
            </div>
          </section>
          <SettingsCard title="Actualizar contraseña" iconName="password">
            <Grid my={20}>
              <Grid.Col span={{ sm: 12 }}>
                <InputField
                  label="Ingresar contraseña actual"
                  name="currentPassword"
                  register={register}
                  errors={errors}
                  type={"password"}
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <InputField
                  label="Ingresar nueva contraseña"
                  name="newPassword"
                  register={register}
                  errors={errors}
                  type={"password"}
                />
              </Grid.Col>
              <Grid.Col span={{ sm: 12 }}>
                <InputField
                  label="Repetir nueva contraseña"
                  name="newPasswordConfirm"
                  register={register}
                  errors={errors}
                  type={"password"}
                />
              </Grid.Col>
            </Grid>
            <div className="w-full flex flex-row gap-2 pt-4">
              <Button
                text={"Descartar"}
                className={"text-xs border border-red-400 text-red-400 bg-white"}
                onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}
              />
              <Button
                text={"Guardar"}
                className="flex h-10 items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
              />
            </div>
          </SettingsCard>
        </div>
      </form>
    </>
  )
}

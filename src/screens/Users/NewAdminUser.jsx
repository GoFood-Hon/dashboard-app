import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Accordion, Flex, Paper, Button } from "@mantine/core"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { AdminInformationForm } from "./AdminInformationForm"
import BackButton from "../Dishes/components/BackButton"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import { newAdminValidationSchema } from "../../utils/inputRules"
import { useDispatch } from "react-redux"
import { createAdminUser } from "../../store/features/userSlice"
import { colors } from "../../theme/colors"
import { useSelector } from "react-redux"

export const NewAdminUser = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.user.creatingUser)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm({ resolver: yupResolver(newAdminValidationSchema) })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: <AdminInformationForm register={register} errors={errors} setValue={setValue} control={control} />
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="flex w-full flex-row items-center rounded-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EE364C] p-2 text-base font-bold text-slate-50">
            {key + 1}
          </div>
          <span className="ml-4 text-base font-bold  leading-normal">{item.title}</span>
          <span className="ml-1 text-base font-normal">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)
    formData.append("password", data.password)
    formData.append("restaurantId", data.restaurantId)

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data.files[0])
    }

    dispatch(createAdminUser({ params: formData, formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)
      })
      .catch((error) => {
        console.error("Error creating user:", error)
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <div className="xs:gap-3 flex flex-row flex-wrap items-center justify-between pb-4">
            <BackButton title="Nuevo administrador" show />
          </div>
        </section>
        <section>
          <Accordion variant="separated" multiple defaultValue={["Información general"]}>
            {items}
          </Accordion>
        </section>
        <section>
          <Paper withBorder radius="md" className="w-full flex md:justify-end mt-3 md:gap-3 rounded-md px-8 py-5">
            <Flex justify="end" gap="xs">
              <Button
                color={colors.main_app_color}
                variant="outline"
                onClick={() => {
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path)
                }}>
                Descartar
              </Button>
              <Button
                loading={isLoading}
                color={colors.main_app_color}
                type="submit"
                className="w-24 text-center flex h-10 items-center justify-center rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50">
                Guardar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}

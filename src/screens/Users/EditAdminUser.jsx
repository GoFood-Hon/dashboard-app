import React, { useEffect, useState } from "react"
import { Accordion, Button, Flex, Paper } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { AdminGeneralInformationForm } from "./AdminGeneralInformationForm"
import { NAVIGATION_ROUTES_SUPER_ADMIN } from "../../routes"
import authApi from "../../api/authApi"
import BackButton from "../Dishes/components/BackButton"
import { colors } from "../../theme/colors"
import { updateUserData } from "../../store/features/userSlice"
import { useSelector, useDispatch } from "react-redux"

export const EditAdminUser = () => {
  const { adminId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [details, setDetails] = useState({})
  const loading = useSelector((state) => state.user.updatingUser)

  useEffect(() => {
    ;(async () => {
      const response = await authApi.getUserDetails(adminId)
      console.log(response)

      if (response?.data) {
        const details = response.data
        setDetails(details)
      }
    })()
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({ defaultValues: details })

  const imageLocation = watch("images[0].location")

  useEffect(() => {
    if (Object.keys(details).length > 0) {
      reset(details)
    }
    window.scrollTo(0, 0)
  }, [details, reset])

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("email", data.email)
    formData.append("phoneNumber", data.phoneNumber.startsWith("+504") ? data.phoneNumber : `+504${data.phoneNumber}`)

    formData.append("restaurantId", data.restaurantId)

    let formDataImage = null
    if (data?.files?.[0]) {
      formDataImage = new FormData()
      formDataImage.append("files", data?.files?.[0])
    }

    dispatch(updateUserData({ id: adminId, params: formData, formDataImage }))
      .unwrap()
      .then(() => {
        navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)
      })
      .catch((error) => {
        console.error("Error updating user:", error)
      })
  }
  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <AdminGeneralInformationForm
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          image={imageLocation}
        />
      )
    }
  ]

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div className="text-slate-50 text-base font-bold bg-[#EE364C] rounded-full p-2 w-8 h-8 flex items-center justify-center">
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <>
      <section>
        <div className="flex flex-row justify-between items-center pb-4">
          <BackButton title={details.name} show />
        </div>
      </section>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Users.path)
                }}>
                Descartar
              </Button>
              <Button loading={loading} color={colors.main_app_color} type="submit">
                Actualizar
              </Button>
            </Flex>
          </Paper>
        </section>
      </form>
    </>
  )
}

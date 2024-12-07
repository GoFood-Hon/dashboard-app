import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllLoyaltyPrograms, fetchLoyaltyProgramsByRestaurant, setPage } from "../../store/features/loyaltySlice"
import { useForm } from "react-hook-form"
import FormLayout from "../../components/Form/FormLayout"
import { colors } from "../../theme/colors"
import { GeneralInformationForm } from "./GeneralInformationForm"
import { Accordion } from "@mantine/core"
import LoyaltyCards from "./LoyaltyCards"

export const LoyaltyProgram = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.loyalty.itemsPerPage)
  const page = useSelector((state) => state.loyalty.currentPage)
  const programsPerPage = useSelector((state) => state.loyalty.programsPerPage)
  const totalPrograms = useSelector((state) => state.loyalty.totalPrograms)
  const totalPageCount = useSelector((state) => state.loyalty.totalPagesCount)
  const programsList = programsPerPage[page] || []
  const loadingPrograms = useSelector((state) => state.loyalty.loadingPrograms)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: programsList
  })

  const accordionStructure = [
    {
      title: "Información general",
      requirement: "Obligatorio",
      form: (
        <GeneralInformationForm data={programsList} register={register} errors={errors} setValue={setValue} control={control} />
      )
    },
    {
      title: "Tarjetas de descuento",
      requirement: "Obligatorio",
      form: <LoyaltyCards register={register} errors={errors} setValue={setValue} control={control} watch={watch} reset={reset} />
    }
  ]

  useEffect(() => {
    if (!programsPerPage[page]) {
      if (user.role === "superadmin") {
        dispatch(fetchAllLoyaltyPrograms({ limit, page, order: "DESC" }))
      } else {
        dispatch(fetchLoyaltyProgramsByRestaurant({ restaurantId: user?.restaurantId, limit, page, order: "DESC" }))
      }
    }
  }, [dispatch, limit, page, programsPerPage])

  const items = accordionStructure.map((item, key) => (
    <Accordion.Item key={key} value={item.title}>
      <Accordion.Control>
        <div className="w-full rounded-lg flex-row flex items-center">
          <div
            className={`text-slate-50 text-base font-bold bg-[${colors.main_app_color}] rounded-full p-2 w-8 h-8 flex items-center justify-center`}>
            {key + 1}
          </div>
          <span className="text-base font-bold  leading-normal ml-4">{item.title}</span>
          <span className="text-base font-normal ml-1">({item?.requirement})</span>
        </div>
      </Accordion.Control>
      <Accordion.Panel>{item.form}</Accordion.Panel>
    </Accordion.Item>
  ))

  useEffect(() => {
    if (Object.keys(programsList).length > 0) {
      reset(programsList)
    }
    window.scrollTo(0, 0)
  }, [programsList, reset])

  const onSubmit = async (data) => {
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout
          title={programsList?.title}
          accordionTitles={["Información general", "Tarjetas de descuento"]}
          accordionItems={items}
          navigate={() => navigate(NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path)}
          isLoading={loadingPrograms}
          update
          noDiscard
        />
      </form>
    </>
  )
}

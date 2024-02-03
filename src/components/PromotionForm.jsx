import React, { useEffect, useState } from "react"
import { Grid, MultiSelect, Select } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { useDispatch, useSelector } from "react-redux"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import Button from "./Button"
import InputField from "./Form/InputField"
import InputCombobox from "./Form/InputCombobox"
import { ErrorMessage } from "./Form/ErrorMessage"
import { promotionValidationFrom } from "../utils/inputRules"
import { fetchDishes, selectAllDishes } from "../store/features/dishesSlice"

export const PromotionForm = () => {
  const user = useSelector((state) => state.user.value)
  const navigate = useNavigate()
  const dishes = useSelector(selectAllDishes)
  const dispatch = useDispatch()

  const filters = useSelector((state) => state.dishes.filters)
  const limit = useSelector((state) => state.dishes.itemsPerPage)
  const page = useSelector((state) => state.dishes.currentPage)

  const [discountType, setDiscountType] = useState("Porcentual")
  const [availabilityDiscount, setAvailabilityDiscount] = useState("En todos los platillos")

  const discountPercentage = []

  for (let i = 5; i <= 100; i += 5) {
    const option = {
      value: i,
      label: `${i} %`
    }
    discountPercentage.push(option)
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(promotionValidationFrom(true))
  })

  const onSubmit = async (data) => {
    reset()
    try {
      const formData = new FormData()

      formData.append("title", data.title)
      formData.append("code", data.code)

      if (discountType === "Porcentual") {
        formData.append("category", "porcentual")
        formData.append("percentage", data.amount)
      } else {
        formData.append("category", "fijo")
        formData.append("amount", data.amount)
      }

      formData.append("startDate", data.startDate)
      formData.append("endDate", data.endDate)

      formData.append("restaurantId", user.restaurantId)

      const response = await couponApi.createCoupon(formData)

      if (response.error) {
        toast.error(`Fallo al crear el cupón. Por favor intente de nuevo. ${response.message}`, {
          duration: 7000
        })
      } else {
        toast.success("Cupón creado exitosamente", {
          duration: 7000
        })
      }
      return response.data
    } catch (error) {
      toast.error(`Error. Por favor intente de nuevo. ${error}`, {
        duration: 7000
      })
    }
  }
  useEffect(() => {
    dispatch(
      fetchDishes({
        limit,
        page,
        order: "DESC",
        restaurantId: user.restaurantId,
        filters
      })
    )
  }, [availabilityDiscount])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid my={20}>
        <Grid.Col span={{ sm: 12 }}>
          <InputField label="Titulo" name="title" register={register} errors={errors} />
        </Grid.Col>
        <Grid.Col span={{ sm: 12 }}>
          <span className="text-sky-950 text-sm font-bold leading-snug">Disponibilidad de la promoción</span>
          <Select
            data={["En todos los platillos", "Seleccionar platillos"]}
            allowDeselect={false}
            size="md"
            value={availabilityDiscount}
            onChange={setAvailabilityDiscount}
          />
        </Grid.Col>
        {availabilityDiscount === "Seleccionar platillos" ? (
          <Grid.Col span={{ sm: 12 }}>
            <span className="text-sky-950 text-sm font-bold leading-snug">Platillos disponibles</span>
            <div className="mt-1">
              <MultiSelect placeholder="Seleccionar menus" size="md" data={dishes.map((menu) => menu.name)} />
            </div>
          </Grid.Col>
        ) : null}
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <span className="text-sky-950 text-sm font-bold leading-snug">Tipo de descuento</span>
          <div className="mt-1">
            <Select
              data={["Fijo", "Porcentual"]}
              allowDeselect={false}
              size="md"
              value={discountType}
              onChange={setDiscountType}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          {discountType === "Fijo" ? (
            <div className="">
              <InputField label="Valor del descuento" name="amount" register={register} errors={errors} />
            </div>
          ) : discountType === "Porcentual" ? (
            <InputCombobox
              items={discountPercentage}
              setValue={setValue}
              errors={errors}
              label="Valor del descuento"
              name="amount"
            />
          ) : null}
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <DatePickerInput
            size="md"
            label="Fecha inicial"
            placeholder="Seleccionar fecha"
            popoverProps={{ withinPortal: false }}
            onChange={(val) => setValue("startDate", val)}
          />
          <ErrorMessage message={errors?.startDate?.message} />
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 6 }}>
          <DatePickerInput
            size="md"
            label="Fecha final"
            placeholder="Seleccionar fecha"
            popoverProps={{ withinPortal: false }}
            onChange={(val) => setValue("endDate", val)}
          />
          <ErrorMessage message={errors?.startDate?.message} />
        </Grid.Col>
      </Grid>
      <div className="w-full flex flex-row gap-2 pt-4">
        <Button
          text={"Descartar"}
          className={"text-xs border border-red-400 text-red-400 bg-white"}
          onClick={() => navigate(SETTING_NAVIGATION_ROUTES.General.path)}
        />
        <Button
          text={"Guardar Cambios"}
          className="flex h-10 w-full items-center justify-center px-4 rounded-md shadow-sm transition-all duration-700 focus:outline-none text-xs bg-sky-950 text-slate-50"
        />
      </div>
    </form>
  )
}

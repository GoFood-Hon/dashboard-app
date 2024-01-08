import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Grid, Select, Tabs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import InputCombobox from "../../components/Form/InputCombobox"
import { DatePickerInput } from "@mantine/dates"
import Button from "../../components/Button"
import { useNavigate } from "react-router-dom"
import { SETTING_NAVIGATION_ROUTES } from "../../routes/index"
import { couponValidation } from "../../utils/inputRules"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "../../components/Form/ErrorMessage"
import couponApi from "../../api/couponApi"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"

export default function CouponsSettings() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user.value)

  const [discountType, setDiscountType] = useState("Porcentual")
  const [couponType, setCouponType] = useState("Por fecha")
  const [dateComponentMounted, setDateComponentMounted] = useState(false)

  useEffect(() => {
    setDateComponentMounted(couponType === "Por fecha")
  }, [couponType])
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(couponValidation(dateComponentMounted))
  })

  const discountPercentage = []

  for (let i = 5; i <= 100; i += 5) {
    const option = {
      value: i,
      label: `${i} %`
    }
    discountPercentage.push(option)
  }

  const onSubmit = async (data) => {
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

      if (couponType === "Por fecha") {
        formData.append("couponType", "fecha")
        formData.append("startDate", data.startDate)
        formData.append("endDate", data.endDate)
      } else {
        formData.append("couponType", "cantidad")
        formData.append("timesToUse", data.timesToUse)
      }

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

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pl-[200px]">
          <section>
            <div className="flex flex-row justify-between items-center pb-6">
              <div className="flex flex-row gap-x-3 items-center">
                <h1 className="text-white-200 text-2xl font-semibold">Cupones</h1>
              </div>
              <div>
                <Breadcrumbs>
                  <BreadCrumbNavigation location={location} />
                </Breadcrumbs>
              </div>
            </div>
          </section>
          <Tabs defaultValue="newCoupon" color="#0e2946">
            <Tabs.List>
              <Tabs.Tab value="newCoupon">Nuevo cupón</Tabs.Tab>
              <Tabs.Tab value="activeCoupons">Cupones activos</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="newCoupon">
              <SettingsCard title="Nuevo cupón" iconName="label">
                <Grid my={20}>
                  <Grid.Col span={{ sm: 12 }}>
                    <InputField label="Titulo" name="title" register={register} errors={errors} />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12 }}>
                    <InputField label="Código de cupón" name="code" register={register} errors={errors} />
                  </Grid.Col>
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
                        placeholder="Seleccione descuento"
                        setValue={setValue}
                        errors={errors}
                        label="Valor del descuento"
                        name="amount"
                      />
                    ) : null}
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12 }}>
                    <span className="text-sky-950 text-sm font-bold leading-snug">Tipo de cupón</span>
                    <div className="mt-1">
                      <Select
                        data={["Por fecha", "Por cantidad de usos"]}
                        allowDeselect={false}
                        size="md"
                        value={couponType}
                        onChange={setCouponType}
                      />
                    </div>
                  </Grid.Col>

                  {couponType === "Por cantidad de usos" ? (
                    <Grid.Col span={{ sm: 12 }}>
                      <InputField label="Veces para utilizar" name="timesToUse" register={register} errors={errors} />
                    </Grid.Col>
                  ) : null}

                  {couponType === "Por fecha" ? (
                    <>
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
                    </>
                  ) : null}
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
              </SettingsCard>
            </Tabs.Panel>
            <Tabs.Panel value="activeCoupons">
              <SettingsCard title="Tabla de cupones activos" iconName="label"></SettingsCard>
            </Tabs.Panel>
          </Tabs>
        </div>
      </form>
    </BaseLayout>
  )
}

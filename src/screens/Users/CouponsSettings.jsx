import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Grid, Tabs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import InputCombobox from "../../components/Form/InputCombobox"
import { DatePickerInput } from "@mantine/dates"
import Button from "../../components/Button"

export default function CouponsSettings() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({})

  const businessType = [
    {
      value: "darkKitchen",
      label: "Dark Kitchen"
    },
    {
      value: "cocina",
      label: "Cocina"
    },
    {
      value: "Glorieta",
      label: "glorieta"
    }
  ]

  const onSubmit = async (data) => {}

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
              <Tabs.Tab value="draft">Borradores</Tabs.Tab>
              <Tabs.Tab value="dueCoupons">Cupones vencidos</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="newCoupon">
              <SettingsCard title="Nuevo cupón" iconName="label">
                <Grid my={20}>
                  <Grid.Col span={{ sm: 12 }}>
                    <InputField label="Titulo" name="title" register={register} errors={errors} />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12 }}>
                    <InputCombobox
                      items={businessType}
                      placeholder="Seleccione el tipo de cupón"
                      setValue={setValue}
                      errors={errors}
                      label="Tipo de cupón"
                      name="type"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <InputCombobox
                      items={businessType}
                      placeholder="Seleccione descuento"
                      setValue={setValue}
                      errors={errors}
                      label="Tipo de descuento"
                      name="discountType"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <InputCombobox
                      items={businessType}
                      placeholder="Seleccione descuento"
                      setValue={setValue}
                      errors={errors}
                      label="Valor del descuento"
                      name="value"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <DatePickerInput
                      size="md"
                      label="Fecha inicial"
                      placeholder="Seleccionar fecha"
                      popoverProps={{ withinPortal: false }}
                      onChange={(val) => setValue("initialDate", val)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12, md: 6 }}>
                    <DatePickerInput
                      size="md"
                      label="Fecha final"
                      placeholder="Seleccionar fecha"
                      popoverProps={{ withinPortal: false }}
                      onChange={(val) => setValue("endDate", val)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ sm: 12 }}>
                    <InputField label="Código de cupón" name="code" register={register} errors={errors} />
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

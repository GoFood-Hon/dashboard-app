import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Grid } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import InputField from "../../components/Form/InputField"
import { useForm } from "react-hook-form"
import InputCombobox from "../../components/Form/InputCombobox"

export default function BankSettings() {
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
  return (
    <BaseLayout>
      <div className="pl-[200px]">
        <section>
          <div className="flex flex-row justify-between items-center pb-6">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 text-2xl font-semibold">Banco</h1>
            </div>
            <div>
              <Breadcrumbs>
                <BreadCrumbNavigation location={location} />
              </Breadcrumbs>
            </div>
          </div>
        </section>
        <SettingsCard title="Banco" iconName="bank">
          <Grid my={20}>
            <Grid.Col span={{ sm: 12 }}>
              <InputCombobox
                items={businessType}
                placeholder="Seleccione banco"
                setValue={setValue}
                errors={errors}
                label="Banco"
                name="type"
              />
            </Grid.Col>
            <Grid.Col span={{ sm: 12 }}>
              <InputField label="Titular de la cuenta" name="name" register={register} errors={errors} />
            </Grid.Col>
          </Grid>
        </SettingsCard>
        <SettingsCard title="Plan" iconName="creditCard"></SettingsCard>
      </div>
    </BaseLayout>
  )
}

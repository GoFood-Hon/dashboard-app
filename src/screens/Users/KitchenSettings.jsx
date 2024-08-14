import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Grid } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useForm } from "react-hook-form"
import SettingsCard from "../../components/SettingsCard"
import InputField from "../../components/Form/InputField"

export default function KitchenSettings() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({})

  const onSubmit = async (data) => {}

  return (
    <BaseLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pl-[200px]">
          <section>
            <div className="flex flex-row justify-between items-center pb-6">
              <div className="flex flex-row gap-x-3 items-center">
                <h1 className="text-white-200 text-2xl font-semibold">Cocina</h1>
              </div>
            </div>
          </section>
          <SettingsCard title="Información general" iconName="chefHat"></SettingsCard>
        </div>
      </form>
    </BaseLayout>
  )
}

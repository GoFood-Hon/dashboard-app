import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Grid, Tabs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import { useForm } from "react-hook-form"
import SettingsCard from "../../components/SettingsCard"

export default function PlanSettings() {
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
                <h1 className="text-white-200 text-2xl font-semibold">Plan</h1>
              </div>
              <div>
                <Breadcrumbs>
                  <BreadCrumbNavigation location={location} />
                </Breadcrumbs>
              </div>
            </div>
          </section>
          <Tabs defaultValue="payments" color="#0e2946">
            <Tabs.List>
              <Tabs.Tab value="payments">Pagos</Tabs.Tab>
              <Tabs.Tab value="history">Historial de pagos</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="payments">
              <SettingsCard title="Plan" iconName="creditCard"></SettingsCard>
              <SettingsCard title="Pago" iconName="creditCard"></SettingsCard>
            </Tabs.Panel>
            <Tabs.Panel value="history">
              <SettingsCard title="Historial de pagos" iconName="creditCard"></SettingsCard>
            </Tabs.Panel>
          </Tabs>
        </div>
      </form>
    </BaseLayout>
  )
}

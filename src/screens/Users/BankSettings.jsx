import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"

export default function BankSettings() {
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
        <SettingsCard title="Banco" iconName="bank"></SettingsCard>
      </div>
    </BaseLayout>
  )
}

import React, { useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Select, Tabs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import { CouponForm } from "../../components/CouponForm"
import { PromotionForm } from "../../components/PromotionForm"
import { HistorySection } from "../../components/HistorySection"

export default function CouponsSettings() {
  const [promotionType, setPromotionType] = useState("Promoción")

  return (
    <BaseLayout>
      <div className="pl-[200px]">
        <section>
          <div className="flex flex-row justify-between items-center pb-6">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 text-2xl font-semibold">Promociones</h1>
            </div>
            <div>
              <Breadcrumbs>
                <BreadCrumbNavigation location={location} />
              </Breadcrumbs>
            </div>
          </div>
        </section>
        <Tabs defaultValue="newPromotion" color="#0e2946">
          <Tabs.List>
            <Tabs.Tab value="newPromotion">Nueva promoción</Tabs.Tab>
            <Tabs.Tab value="couponHistory">Historial de cupones</Tabs.Tab>
            <Tabs.Tab value="promosHistory">Historial de promociones</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="newPromotion">
            <SettingsCard title={`Nueva promoción de ${promotionType}`} iconName="label">
              <div className="w-full mt-4">
                <span className="text-sky-950 text-sm font-bold leading-snug">Tipo de promoción</span>
                <div className="mt-1">
                  <Select
                    data={["Cupón", "Promoción"]}
                    allowDeselect={false}
                    size="md"
                    value={promotionType}
                    onChange={setPromotionType}
                  />
                </div>
              </div>
              {promotionType === "Cupón" ? <CouponForm /> : null}
              {promotionType === "Promoción" ? <PromotionForm /> : null}
            </SettingsCard>
          </Tabs.Panel>
          <Tabs.Panel value="couponHistory">
            <SettingsCard title="Tabla de historial de cupones" iconName="label">
              <HistorySection section="Cupones" />
            </SettingsCard>
          </Tabs.Panel>
          <Tabs.Panel value="promosHistory">
            <SettingsCard title="Tabla de historial de promociones" iconName="label">
              <HistorySection section="Promociones" />
            </SettingsCard>
          </Tabs.Panel>
        </Tabs>
      </div>
    </BaseLayout>
  )
}

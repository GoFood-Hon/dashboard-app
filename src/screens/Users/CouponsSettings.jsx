import React, { useState } from "react"
import { Flex, Group, Select, Space, Stack, Tabs } from "@mantine/core"
import SettingsCard from "../../components/SettingsCard"
import { CouponForm } from "../../components/CouponForm"
import { PromotionForm } from "../../components/PromotionForm"
import { HistorySection } from "../../components/HistorySection"
import { colors } from "../../theme/colors"
import BackButton from "../Dishes/components/BackButton"

export default function CouponsSettings() {
  const [promotionType, setPromotionType] = useState("Promoción")

  return (
    <Stack gap='xs'>
      <Group grow>
        <Flex align="center" justify="space-between">
          <BackButton title="Promociones" />
        </Flex>
      </Group>
      
      <Tabs defaultValue="newPromotion" color={colors.main_app_color}>
        <Tabs.List>
          <Tabs.Tab value="newPromotion">Nueva promoción</Tabs.Tab>
          <Tabs.Tab value="couponHistory">Historial de cupones</Tabs.Tab>
          <Tabs.Tab value="promosHistory">Historial de promociones</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="newPromotion" pt='sm'>
          <SettingsCard title="Datos de promoción" iconName="label">
            <div className="w-full mt-4">
              <span className="text-sm font-bold leading-snug">Tipo de promoción</span>
              <div className="mt-1">
                <Select
                  data={["Cupón", "Promoción"]}
                  allowDeselect={false}
                  value={promotionType}
                  onChange={setPromotionType}
                />
              </div>
            </div>
            {promotionType === "Cupón" ? <CouponForm /> : null}
            {promotionType === "Promoción" ? <PromotionForm /> : null}
          </SettingsCard>
        </Tabs.Panel>
        <Tabs.Panel value="couponHistory" pt='sm'>
          <SettingsCard title="Tabla de historial de cupones" iconName="label">
            <HistorySection section="Cupones" />
          </SettingsCard>
        </Tabs.Panel>
        <Tabs.Panel value="promosHistory" pt='sm'>
          <SettingsCard title="Tabla de historial de promociones" iconName="label">
            <HistorySection section="Promociones" />
          </SettingsCard>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

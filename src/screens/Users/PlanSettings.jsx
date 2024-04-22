import React from "react"
import BaseLayout from "../../components/BaseLayout"
import { Breadcrumbs, Grid, Tabs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import { useSelector } from "react-redux"

export default function PlanSettings() {
  const user = useSelector((state) => state.user.value)
  const planData = user.Restaurant.Subscription.Plan

  return (
    <BaseLayout>
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
            <Tabs.Tab value="payments">Plan Activo</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="payments">
            <SettingsCard title={`Plan: ${planData.name}`} iconName="creditCard">
              <PlanDetailsCard plan={planData} />
            </SettingsCard>
          </Tabs.Panel>
        </Tabs>
      </div>
    </BaseLayout>
  )
}

const PlanDetailsCard = ({ plan }) => {
  const { name, price, tax, currency, paymentType, PlanFeatures } = plan

  return (
    <div className="border rounded-lg border-blue-100 p-4 bg-white m-4">
      <h1 className="text-lg font-semibold mb-2">{name}</h1>
      <p>
        <span className="font-semibold">Price:</span> {currency} {price} per {paymentType.toLowerCase()} (including {tax}% tax)
      </p>
      <h2 className="text-md font-semibold mt-4 mb-2">Features Included:</h2>
      <ul className="list-disc pl-6">
        {PlanFeatures.map((feature) => (
          <li key={feature.id}>
            {feature.name}: {feature.PlanPlanFeatures.quan}{" "}
            {feature.type === "amount" ? "" : feature.PlanPlanFeatures.avai ? "Included" : "Not Included"}
          </li>
        ))}
      </ul>
    </div>
  )
}

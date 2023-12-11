import React from "react"
import BaseLayout from "../../components/BaseLayout"
import Button from "../../components/Button"
import { Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsSidebar from "./SettingsSidebar"

export default function UserSettings() {
  const handleNavigateNewUser = () => {}

  return (
    <BaseLayout>
      <SettingsSidebar />
    </BaseLayout>
  )
}

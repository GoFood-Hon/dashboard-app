import React from "react"
import SettingsCard from "../../components/SettingsCard"

export default function PersonalSettings() {
  return (
    <>
      <div className="pl-[200px]">
        <section>
          <div className="flex flex-row justify-between items-center pb-6">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 text-2xl font-semibold">Personal</h1>
            </div>
          </div>
        </section>
        <SettingsCard title="Personal" iconName="users"></SettingsCard>
      </div>
    </>
  )
}

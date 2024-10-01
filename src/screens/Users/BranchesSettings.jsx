import React from "react"
import { useForm } from "react-hook-form"
import SettingsCard from "../../components/SettingsCard"

export default function BranchesSettings() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({})

  const onSubmit = async (data) => {}

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pl-[200px]">
          <section>
            <div className="flex flex-row justify-between items-center pb-6">
              <div className="flex flex-row gap-x-3 items-center">
                <h1 className="text-white-200 text-2xl font-semibold">Sucursales</h1>
              </div>
            </div>
          </section>
          <SettingsCard title="Información general" iconName="warehouse"></SettingsCard>
        </div>
      </form>
    </>
  )
}

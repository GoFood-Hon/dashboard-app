import React, { useEffect, useState } from "react"
import BaseLayout from "../../components/BaseLayout"
import { Avatar, Breadcrumbs } from "@mantine/core"
import BreadCrumbNavigation from "../../components/BreadCrumbNavigation"
import SettingsCard from "../../components/SettingsCard"
import authApi from "../../api/authApi"

export default function AccountSettings() {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getUser()
        console.log(response.data.data)
        if (response.error) {
          toast.error("Error en la respuesta de la información del usuario")
        } else {
          setUserData(response.data.data)
        }
      } catch (error) {
        toast.error("Error obteniendo información del usuario")
      }
    }
    fetchUser()
  }, [])

  return (
    <BaseLayout>
      <div className="pl-[200px]">
        <section>
          <div className="flex flex-row justify-between items-center pb-6">
            <div className="flex flex-row gap-x-3 items-center">
              <h1 className="text-white-200 text-2xl font-semibold">Cuenta</h1>
            </div>
            <div>
              <Breadcrumbs>
                <BreadCrumbNavigation location={location} />
              </Breadcrumbs>
            </div>
          </div>
        </section>
        <SettingsCard title="Información general" iconName="user">
          <Avatar size="xl" src={userData?.images?.[0]?.location} />
          <div className="flex flex-col w-full py-2">
            <span className="text-sky-950 font-semibold">Nombre</span>
            <div className="p-3 rounded-lg border border-blue-100">{userData.name}</div>
          </div>
          <div className="flex flex-col w-full py-2">
            <span className="text-sky-950 font-semibold">Correo</span>
            <div className="p-3 rounded-lg border border-blue-100">{userData.email}</div>
          </div>
          <div className="flex flex-col w-full py-2">
            <span className="text-sky-950 font-semibold">Teléfono</span>
            <div className="p-3 rounded-lg border border-blue-100">{userData.phoneNumber}</div>
          </div>
        </SettingsCard>
      </div>
    </BaseLayout>
  )
}

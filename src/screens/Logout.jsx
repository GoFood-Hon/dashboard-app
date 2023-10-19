import React from "react"
import LoadingCircle from "../components/LoadingCircle"
import BaseLayout from "../components/BaseLayout"

export default function Logout() {
  return (
    <BaseLayout>
      <div className="flex w-full h-screen justify-center items-center flex-col gap-4">
        <span>Cerrando sesión 👋</span>
        <LoadingCircle />
      </div>
    </BaseLayout>
  )
}

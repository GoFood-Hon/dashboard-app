import { Button } from "@mantine/core"
import React from "react"
import { colors } from "../../theme/colors"
import { IconPlus } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex justify-center items-center border-2 mx-auto">
      <div className="flex flex-col">
        <span className={`bg-[#FAF2AD] w-fit font-bold`}>404 Not Found</span>
        <article className="text-4xl">La pagina solicitada no esta disponible.</article>
        <div className="w-fit my-2">
          <Button
            className="my-2 w-fit"
            color={colors.dark_selected_element}
            leftSection={<IconPlus size={14} />}
            onClick={() => navigate("/")}>
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

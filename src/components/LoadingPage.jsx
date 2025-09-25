import { Loader } from "@mantine/core"
import { colors } from "../theme/colors"

export const LoadingPage = () => {
  return (
    <div className="h-[calc(100vh-150px)] w-full flex justify-center items-center">
      <Loader color={colors.main_app_color} />
    </div>
  )
}
import { Box, Text } from "@mantine/core"
import React from "react"
import Lottie from "react-lottie"
import animationData from "../../assets/animation/NoPermissionAnimation.json"

export const NoPermissionsAnimation = ({ moduleName }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  return (
    <Box className="h-[calc(100vh-200px)] w-full flex flex-col p-4 space-y-4 justify-center items-center">
      <Lottie isClickToPauseDisabled={true} options={defaultOptions} height={90} width={90} />
      <Text maw={600} size="md" fw={600} align="center">
        {`Tu plan actual no cuenta con el módulo de ${moduleName}. Si lo necesitas, puedes cambiarte a uno que si lo posea.`}
      </Text>
    </Box>
  )
}

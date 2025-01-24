import React from "react"
import Lottie from "react-lottie"
import passwordRecovered from "../../../assets/animation/PassRecovered.json"
import { Text } from "@mantine/core"

export default function SuccessScreen() {
  const defaultOptions = {
    autoplay: true,
    animationData: passwordRecovered
  }
  return (
    <>
      <Lottie options={defaultOptions} isClickToPauseDisabled={true} height={200} />
      <Text fw={700} size="sm" ta="center" tt="uppercase" c="dimmed" fs="italic">
        Contraseña restablecida
      </Text>
    </>
  )
}

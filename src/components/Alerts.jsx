import { Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { colors } from "../theme/colors"

export const Alerts = ({ title, setShowAlert, description, subdescription }) => {
  return (
    <Alert
      style={{
        position: "fixed",
        bottom: 20,
        right: 16,
        zIndex: 9999,
        width: 500
      }}
      variant="filled"
      color={colors.main_app_color}
      title={title}
      icon={<IconAlertCircle />}
      withCloseButton
      onClose={() => {
        localStorage.setItem("hideSubscriptionAlert", "true")
        setShowAlert(false)
      }}
      radius="md">
      {description}
      <br />
      <br />
      {subdescription}
    </Alert>
  )
}

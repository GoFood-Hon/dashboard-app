import toast from "react-hot-toast"
import { colors, palette } from "../theme/colors"

const Severity = {
  Success: "success",
  Error: "error",
  Info: "info",
  Warning: "warning"
}

const Length = {
  Short: "short",
  Long: "long",
  Indefinite: "indefinite"
}

/**
 * @param severity
 * @returns return background color
 */
function getPreset(severity) {
  if (severity === Severity.Success) {
    return colors.link_text
  } else if (severity === Severity.Error) {
    return colors.red
  } else if (severity === Severity.Warning) {
    return colors.element_tag_bg
  }
  return palette.white
}

/**
 * @param length
 * @returns returns duration length
 */
function getDuration(length) {
  if (length === Length.Long) {
    return 5000
  } else if (length === Length.Indefinite) {
    return 0
  }
  return 3000
}

/**
 * Custom pop-up utility that displays pop-up messages
 *
 * @param text The text to show on the toast notification
 * @param durationLength The duration for which the notification bar should be visible
 */
export function showToast({ message, severity, length, ...rest }) {
  const duration = severity === Severity.Error ? 5000 : getDuration(length)
  const backgroundColor = getPreset(severity)

  if (rest.loading || rest.success || rest.error) {
    toast.promise(saveSettings, {
      loading: rest.loading || "Loading...",
      success: rest.success || "Success",
      error: rest.error || "Error"
    })
  } else if (rest.icon || rest.style) {
    toast(message, {
      duration,
      style: {
        background: rest.style?.background || backgroundColor,
        color: rest.style?.color || "#000",
        ...rest.style
      },
      icon: rest.icon || "ℹ️"
    })
  } else {
    toast(message, {
      duration,
      style: {
        background: backgroundColor
      },
      ...rest
    })
  }
}

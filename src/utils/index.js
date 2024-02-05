import { format, formatDistanceToNow, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export function getFormattedHNL(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HNL"
  }).format(amount)
}

export function bytesToMB(bytes) {
  const megabytes = bytes / (1024 * 1024)
  return megabytes.toFixed(2)
}

/**
 * @param {string} dateString
 * @returns {string} formatted date distance
 */
export const formatDateDistanceToNow = (dateString) => {
  const date = new Date(dateString)

  if (isNaN(date)) {
    return "Fecha inválida"
  }

  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

/**
 *
 * @param {string} dateString Input 2024-02-01T06:00:00.000Z
 * @returns {string} Output: "13 julio, 2024"
 */

export const formatDateToString = (dateString) => {
  let parsedDate
  try {
    parsedDate = parseISO(dateString)
    return format(parsedDate, "dd LLLL, yyyy", { locale: es })
  } catch (error) {
    console.error(`Error al formatear la fecha: ${error.message} date: ${parsedDate}`)
    return "Fecha inválida"
  }
}

// fecha mala:  "2024-01-28T23:27:43.612Z"
// fecha buena: "2024-02-01T23:03:29.046Z"

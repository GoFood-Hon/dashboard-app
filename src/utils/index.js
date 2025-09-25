import { format, formatDistanceToNow, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { hondurasDepartments } from "./constants"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import { NAVIGATION_ROUTES_SUPER_ADMIN_TWO } from "../routes"

dayjs.extend(utc)
dayjs.extend(timezone)

export function getFormattedHNL(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HNL"
  }).format(amount)
}

export function getFormattedUSD(amount) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount)

  return `USD ${formatted.slice(1)}`
}

export function toPercentage(value) {
  const num = parseFloat(value)
  if (isNaN(num)) return ""
  return `${(num * 100).toFixed(0)}%`
}

export const formatDay = (day) => {
  const daysInSpanish = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo"
  }
  return daysInSpanish[day]
}

export function dateTimeConverter(timestamptz) {
  if (!timestamptz) return "Fecha inválida"

  const date = new Date(timestamptz)

  const formattedDate = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC" // 👈 fuerza a no mover la hora
  }).format(date)

  const formattedTime = new Intl.DateTimeFormat("es", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC" // 👈 fuerza a no mover la hora
  }).format(date)

  return `${formattedDate} a las ${formattedTime}`
}

export const formatTime = (time) => dayjs.utc(time).tz("America/Tegucigalpa").format("DD/MM/YYYY hh:mm A")

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
    return "Fecha inválida"
  }
}

/**
 *
 * @param {number} id
 * @returns {string}
 */
export function getDepartmentNameById(id) {
  const department = hondurasDepartments.find((department) => department.id === id)
  return department ? department.name : null
}

/**
 * @param {string} priceString
 * @returns {float} 23.00
 */
export function convertToDecimal(priceString) {
  return parseFloat(priceString).toFixed(2)
}

export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const calculateTimeDifference = (sentToKitchenTimestamp, finishedCookingTimestamp) => {
  const start = dayjs(sentToKitchenTimestamp)
  const end = dayjs(finishedCookingTimestamp)

  const durationInSeconds = end.diff(start, "second")

  const hours = Math.floor(durationInSeconds / 3600)
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
  const seconds = durationInSeconds % 60

  let result = ""
  if (hours > 0) {
    result += `${hours} hora${hours > 1 ? "s" : ""} `
  }
  if (minutes > 0) {
    result += `${minutes} minuto${minutes > 1 ? "s" : ""} `
  }
  if (seconds > 0 || result === "") {
    result += `${seconds} segundo${seconds > 1 ? "s" : ""}`
  }

  return result.trim()
}

export const formatTimeDifference = (sentToKitchenTimestamp, finishedCookingTimestamp) => {
  const start = dayjs(sentToKitchenTimestamp)
  const end = dayjs(finishedCookingTimestamp)

  const durationInSeconds = end.diff(start, "second")

  const days = Math.floor(durationInSeconds / 86400)
  const hours = Math.floor((durationInSeconds % 86400) / 3600)
  const minutes = Math.floor((durationInSeconds % 3600) / 60)
  const seconds = durationInSeconds % 60

  const parts = []

  if (days > 0) {
    parts.push(String(days).padStart(2, "0"))
  }

  parts.push(String(hours).padStart(2, "0"))
  parts.push(String(minutes).padStart(2, "0"))
  parts.push(String(seconds).padStart(2, "0"))

  return parts.join(":")
}

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

export const transformChartsData = (data, allowOnSite) => {
  return data.map((item) => {
    const formattedDate = dayjs(item.date).format("MMMM D")

    return {
      date: capitalize(formattedDate),
      "A domicilio": item.delivery,
      "Para llevar": item.pickup,
      ...(allowOnSite && { "Venta en mesa": item.onSite })
    }
  })
}

export const onError = (errors) => {
  const firstErrorKey = Object.keys(errors)[0]
  const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`)

  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" })
    firstErrorElement.focus()
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

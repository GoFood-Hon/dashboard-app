import { format, formatDistanceToNow, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { hondurasDepartments } from "./constants"
import dayjs from "dayjs"

export function getFormattedHNL(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "HNL"
  }).format(amount)
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
  };
  return daysInSpanish[day];
};

export function dateTimeConverter(timestamptz) {
  const timeZone = 'America/Tegucigalpa' // Zona horaria de Honduras
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }

  const date = new Date(timestamptz)
  const formattedDate = date.toLocaleDateString('es', options)

  const hour = date.getHours()
  const minute = date.getMinutes()
  const amPm = hour >= 12 ? 'p. m.' : 'a. m.'
  const hour12 = hour % 12 || 12

  return `${formattedDate} a ${hour12 !== 1 ? 'las' : 'la'} ${hour12}:${
    minute < 10 ? '0' : ''
  }${minute} ${amPm}`
}

export const formatTime = (time) => dayjs(time, "HH:mm:ss").format("hh:mm A");

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
  // Convert the string to a decimal number with two decimal places
  return parseFloat(priceString).toFixed(2)
}

export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

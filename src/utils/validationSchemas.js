import { z } from "zod";

const nullableStringOrNumberToString = z.union([
  z.string(),
  z.number(),
  z.null()
]).transform((val) => val === null ? undefined : String(val));

// Función para validar si un elemento es un File o un objeto con 'location'
const isValidFileOrUrl = (item) =>
  item instanceof File ||
  (item &&
    typeof item === "object" &&
    "location" in item &&
    typeof item.location === "string" &&
    item.location.length > 0);

export const restaurantSchema = z
  .object({
    bannerDishes: z.array(z.any()),
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
    phoneNumber: z.string().min(1, "El número de teléfono es requerido"),
    socialReason: z.string().min(1, "La razón social es requerida"),
    rtn: z.string().min(1, "El RTN es requerido").max(14, "El RTN debe tener máximo 14 caracteres"),
    cai: z.string().min(1, "El CAI es requerido"),
    billingAddress: z.string().min(1, "La dirección de facturación es requerida"),
    cuisineTypeId: z.string().min(1, "El tipo de cocina es requerido"),
    clinpaysCommerceToken: z.string().min(1, "El token de comercio de Clinpays es requerido"),
    files: z.array(z.any()),
    shippingFree: z.boolean().nullable().optional(),

    pricePerChair: nullableStringOrNumberToString.optional(),
    hoursBeforeCancellation: nullableStringOrNumberToString.optional(),
    hoursBeforeBooking: nullableStringOrNumberToString.optional(),
    shippingPrice: nullableStringOrNumberToString.optional(),
  })
  .refine((data) => {
    const hasAll = data.pricePerChair && data.hoursBeforeCancellation && data.hoursBeforeBooking;
    const hasNone = !data.pricePerChair && !data.hoursBeforeCancellation && !data.hoursBeforeBooking;
    return hasAll || hasNone;
  }, {
    message: "Debes completar todos los campos de reservación o dejarlos vacíos.",
    path: ["pricePerChair"],
  })
  .superRefine((data, ctx) => {
    if (data.shippingFree === false && (!data.shippingPrice || data.shippingPrice.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio del envío es requerido cuando el envío no es gratuito",
        path: ["shippingPrice"],
      });
    }

    const hasValidBanner = data.bannerDishes.some(isValidFileOrUrl);
    if (!hasValidBanner) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El banner del comercio es requerido",
        path: ["bannerDishes"],
      });
    }

    const hasValidImage = data.files.some(isValidFileOrUrl);
    if (!hasValidImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La imagen del comercio es requerida",
        path: ["files"],
      });
    }
  });

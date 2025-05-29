import { z } from "zod"

export const restaurantSchema = z
  .object({
    bannerDishes: z.array(z.instanceof(File)).min(1, "El banner del comercio es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().min(1, "El correo electrónico es requerido").email("Correo electrónico inválido"),
    phoneNumber: z.string().min(1, "El número de teléfono es requerido"),
    socialReason: z.string().min(1, "La razón social es requerida"),
    rtn: z.string().min(1, "El RTN es requerido").max(14, "El RTN debe tener máximo 14 caracteres"),
    cai: z.string().min(1, "El CAI es requerido"),
    billingAddress: z.string().min(1, "La dirección de facturación es requerida"),
    cuisineTypeId: z.string().min(1, "El tipo de cocina es requerido"),
    clinpaysCommerceToken: z.string().min(1, "El token de comercio de Clinpays es requerido"),
    files: z.array(z.instanceof(File)).min(1, "La imagen del comercio es requerida"),
    shippingFree: z.boolean().nullable().optional(),

    pricePerChair: z.string().optional(),
    hoursBeforeCancellation: z.string().optional(),
    hoursBeforeBooking: z.string().optional(),

    shippingPrice: z.string().optional()
  })
  // Validación cruzada de los 3 campos
  .refine((data) => !data.pricePerChair || (data.hoursBeforeCancellation && data.hoursBeforeBooking), {
    message: "Completa los campos de 'Horas de anticipo para reservación' y 'Horas antes de la reservación para pagarla'",
    path: ["pricePerChair"]
  })
  .refine((data) => !data.hoursBeforeCancellation || (data.pricePerChair && data.hoursBeforeBooking), {
    message: "Completa los campos de 'Precio por silla' y 'Horas antes de la reservación para pagarla'",
    path: ["hoursBeforeCancellation"]
  })
  .refine((data) => !data.hoursBeforeBooking || (data.pricePerChair && data.hoursBeforeCancellation), {
    message: "Completa los campos de 'Precio por silla' y 'Horas de anticipo para reservación'",
    path: ["hoursBeforeBooking"]
  })
  .superRefine((data, ctx) => {
    if (data.shippingFree === false && (!data.shippingPrice || data.shippingPrice.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio del envío es requerido cuando el envío no es gratuito",
        path: ["shippingPrice"]
      })
    }
  })

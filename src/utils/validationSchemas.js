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
    whatsapp: z.string().optional().nullable(),
    facebook: z.string().url('Debes ingresar una URL válida').optional().nullable(),
    instagram: z.string().url('Debes ingresar una URL válida').optional().nullable(),
    website: z.string().url('Debes ingresar una URL válida').optional().nullable(),

    // Campos de reservación de mesa
    pricePerChair: z.union([z.string(), z.null()]).optional(),
    hoursBeforeCancellation: z.union([z.string(), z.null()]).optional(),
    hoursBeforeBooking: z.union([z.string(), z.null()]).optional(),

    shippingPrice: z.string().optional()
  })
  .superRefine((data, ctx) => {
    // Validación condicional de envío
    if (data.shippingFree === false && (!data.shippingPrice || data.shippingPrice.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio del envío es requerido cuando el envío no es gratuito",
        path: ["shippingPrice"]
      })
    }

    const { pricePerChair, hoursBeforeCancellation, hoursBeforeBooking } = data

    const anyFilled = pricePerChair || hoursBeforeCancellation || hoursBeforeBooking

    // Validar si uno está lleno y los otros no
    if (anyFilled) {
      if (!pricePerChair || pricePerChair.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es requerido si se usan reservaciones de mesa",
          path: ["pricePerChair"]
        })
      }
      if (!hoursBeforeCancellation || hoursBeforeCancellation.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es requerido si se usan reservaciones de mesa",
          path: ["hoursBeforeCancellation"]
        })
      }
      if (!hoursBeforeBooking || hoursBeforeBooking.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Este campo es requerido si se usan reservaciones de mesa",
          path: ["hoursBeforeBooking"]
        })
      }
    }
  })

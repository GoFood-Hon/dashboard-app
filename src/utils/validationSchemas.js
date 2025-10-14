import { z } from "zod"

export const newRestaurantSchema = z
  .object({
    bannerDishes: z.array(z.instanceof(File)).min(1, "El banner del comercio es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .regex(/.+@.+\..+/, "El correo no es válido"),
    phoneNumber: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^(\+504)?\d{8}$/, "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"),
    socialReason: z.string().min(1, "La razón social es requerida"),
    rtn: z.string().min(1, "El RTN es requerido").max(14, "El RTN debe tener máximo 14 caracteres"),
    cai: z.string().min(1, "El CAI es requerido"),
    billingAddress: z.string().min(1, "La dirección de facturación es requerida"),
    cuisineTypeId: z.string().min(1, "El tipo de establecimiento es requerido"),
    clinpaysCommerceToken: z.string().min(1, "El token de comercio de Clinpays es requerido"),
    files: z.array(z.instanceof(File)).min(1, "La imagen del comercio es requerida"),
    shippingFree: z.boolean().nullable().optional(),
    whatsapp: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true

          return /^(\+504)?\d{8}$/.test(val)
        },
        {
          message: "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"
        }
      ),

    facebook: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || z.string().url().safeParse(val).success, { message: "Debes ingresar una URL válida" }),
    instagram: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || z.string().url().safeParse(val).success, { message: "Debes ingresar una URL válida" }),
    website: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || z.string().url().safeParse(val).success, { message: "Debes ingresar una URL válida" }),

    pricePerChair: z.union([z.string(), z.null()]).optional(),
    hoursBeforeCancellation: z.union([z.string(), z.null()]).optional(),
    hoursBeforeBooking: z.union([z.string(), z.null()]).optional(),

    shippingPrice: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.shippingFree === false && (!data.shippingPrice || data.shippingPrice.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio del envío es requerido cuando el envío no es gratuito",
        path: ["shippingPrice"]
      })
    }

    const { pricePerChair, hoursBeforeCancellation, hoursBeforeBooking } = data

    const anyFilled = pricePerChair || hoursBeforeCancellation || hoursBeforeBooking

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

export const editRestaurantSchema = z
  .object({
    bannerDishes: z
      .any()
      .refine(
        (value) =>
          value === undefined ||
          value === null ||
          (Array.isArray(value) &&
            (value.length === 0 ||
              value.every((item) => item instanceof File || (item && typeof item === "object" && "location" in item)))),
        {
          message: "El banner del comercio debe ser un archivo válido o una imagen existente",
          path: ["bannerDishes"]
        }
      )
      .optional(),
    name: z.string().min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .regex(/.+@.+\..+/, "El correo no es válido"),
    phoneNumber: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^(\+504)?\d{8}$/, "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"),
    socialReason: z.string().min(1, "La razón social es requerida"),
    rtn: z.string().min(1, "El RTN es requerido").max(14, "El RTN debe tener máximo 14 caracteres"),
    cai: z.string().min(1, "El CAI es requerido"),
    billingAddress: z.string().min(1, "La dirección de facturación es requerida"),
    cuisineTypeId: z
      .string()
      .nullable()
      .refine((val) => typeof val === "string" && val.trim() !== "", {
        message: "El tipo de establecimiento es requerido"
      }),
    clinpaysCommerceToken: z.string().min(1, "El token de comercio de Clinpays es requerido"),

    files: z
      .any()
      .refine(
        (value) =>
          value === undefined || value === null || (Array.isArray(value) && (value.length === 0 || value[0] instanceof File)),
        {
          message: "La imagen del comercio debe ser un archivo válido",
          path: ["files"]
        }
      )
      .optional(),

    shippingFree: z.boolean().nullable().optional(),
    whatsapp: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true

          return /^(\+504)?\d{8}$/.test(val)
        },
        {
          message: "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"
        }
      ),

    facebook: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: "Debes ingresar una URL válida"
      }),

    instagram: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: "Debes ingresar una URL válida"
      }),

    website: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || z.string().url().safeParse(val).success, {
        message: "Debes ingresar una URL válida"
      }),

    // Campos de reservación de mesa
    pricePerChair: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => (val != null ? String(val) : val))
      .optional(),

    hoursBeforeCancellation: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => (val != null ? String(val) : val))
      .optional(),

    hoursBeforeBooking: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) => (val != null ? String(val) : val))
      .optional(),

    shippingPrice: z.string().nullable().optional()
  })
  .superRefine((data, ctx) => {
    if (data.shippingFree === false && (!data.shippingPrice || data.shippingPrice.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El precio del envío es requerido cuando el envío no es gratuito",
        path: ["shippingPrice"]
      })
    }

    const { pricePerChair, hoursBeforeCancellation, hoursBeforeBooking } = data
    const anyFilled = pricePerChair || hoursBeforeCancellation || hoursBeforeBooking

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

export const collectionsSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    type: z.enum(["dishes", "restaurants"]),
    dishes: z.array(z.string().uuid()).optional().default([]),
    restaurants: z.array(z.string().uuid()).optional().default([]),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida"
      })
      .default([])
  })
  .superRefine((data, ctx) => {
    if (data.type === "dishes" && (!data.dishes || data.dishes.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Debes agregar al menos 1 producto a la colección",
        path: ["dishes"]
      })
    }
    if (data.type === "restaurants" && (!data.restaurants || data.restaurants.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Debes agregar al menos 1 comercio a la colección",
        path: ["restaurants"]
      })
    }
    if (!data.files || data.files.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "La imagen de la colección es requerida",
        path: ["files"]
      })
    }
  })

export const editCollectionsSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    type: z.enum(["dishes", "restaurants"]),
    banner: z
      .array(
        z.object({
          location: z.string().url(),
          key: z.string()
        })
      )
      .optional(),
    dishes: z
      .array(
        z.union([
          z.string().uuid(),
          z.object({
            id: z.string().uuid()
          })
        ])
      )
      .optional()
      .default([])
      .transform((arr) => arr.map((item) => (typeof item === "string" ? item : item.id))),
    restaurants: z
      .array(
        z.union([
          z.string().uuid(),
          z.object({
            id: z.string().uuid()
          })
        ])
      )
      .optional()
      .default([])
      .transform((arr) => arr.map((item) => (typeof item === "string" ? item : item.id))),
    deletedElements: z.array(z.string().uuid()).optional().default([]),
    newElements: z.array(z.string().uuid()).optional().default([]),
    isActive: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida"
      })
      .optional()
      .default([])
  })
  .superRefine((data, ctx) => {
    if (data.type === "dishes" && (!data.dishes || data.dishes.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Debes agregar al menos 1 producto a la colección",
        path: ["dishes"]
      })
    }
    if (data.type === "restaurants" && (!data.restaurants || data.restaurants.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Debes agregar al menos 1 comercio a la colección",
        path: ["restaurants"]
      })
    }
  })

export const newAdminUserSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .regex(/.+@.+\..+/, "El correo no es válido"),
    phoneNumber: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^(\+504)?\d{8}$/, "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "La contraseña debe contener al menos un carácter especial"),
    passwordConfirm: z.string().min(1, "La confirmación de contraseña es requerida"),
    restaurantId: z
      .string({
        required_error: "El comercio es requerido"
      })
      .min(1, "Debes seleccionar un comercio"),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida",
        required_error: "La imagen del usuario es requerida"
      })
      .min(1, "La imagen del usuario es requerida")
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        code: "custom",
        message: "Las contraseñas no coinciden"
      })
    }
    if (!data.files || data.files.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "La imagen del usuario es requerida",
        path: ["files"]
      })
    }
  })

export const editAdminUserSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .regex(/.+@.+\..+/, "El correo no es válido"),
    phoneNumber: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^(\+504)?\d{8}$/, "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"),
    restaurantId: z
      .string({
        required_error: "El comercio es requerido"
      })
      .min(1, "Debes seleccionar un comercio"),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida"
      })
      .default([])
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        code: "custom",
        message: "Las contraseñas no coinciden"
      })
    }
  })

export const profileSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .regex(/.+@.+\..+/, "El correo no es válido"),
    phoneNumber: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^(\+504)?\d{8}$/, "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    newPasswordConfirm: z.string().optional(),

    files: z
      .any()
      .refine(
        (value) =>
          value === null || value === undefined || (Array.isArray(value) && (value.length === 0 || value[0] instanceof File)),
        {
          message: "Debe subir una imagen válida",
          path: ["files"]
        }
      )
      .optional()
  })
  .superRefine((data, ctx) => {
    const { currentPassword, newPassword, newPasswordConfirm } = data

    const anyPasswordFilled = currentPassword || newPassword || newPasswordConfirm

    if (anyPasswordFilled) {
      if (!currentPassword) {
        ctx.addIssue({
          path: ["currentPassword"],
          code: z.ZodIssueCode.custom,
          message: "La contraseña actual es requerida"
        })
      }

      if (!newPassword) {
        ctx.addIssue({
          path: ["newPassword"],
          code: z.ZodIssueCode.custom,
          message: "La nueva contraseña es requerida"
        })
      }

      if (!newPasswordConfirm) {
        ctx.addIssue({
          path: ["newPasswordConfirm"],
          code: z.ZodIssueCode.custom,
          message: "Debe confirmar la nueva contraseña"
        })
      }

      if (newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm) {
        ctx.addIssue({
          path: ["newPasswordConfirm"],
          code: z.ZodIssueCode.custom,
          message: "Las contraseñas no coinciden"
        })
      }
    }
  })

export const newMenuSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  files: z
    .array(z.instanceof(File), {
      invalid_type_error: "Debes subir una imagen válida",
      required_error: "La imagen del menú es requerida"
    })
    .min(1, "La imagen del menú es requerida"),

  dishes: z.array(z.string()).min(1, "Debes seleccionar al menos un producto para el menú").default([])
})

export const editMenuSchema = z
  .object({
    name: z.string().min(1, "El nombre del menú es requerido"),
    description: z.string().min(1, "La descripción es requerida"),

    files: z
      .any()
      .refine(
        (value) =>
          value === undefined || value === null || (Array.isArray(value) && (value.length === 0 || value[0] instanceof File)),
        {
          message: "La imagen del comercio debe ser un archivo válido",
          path: ["files"]
        }
      )
      .optional(),

    dishes: z
      .array(z.union([z.string(), z.object({ id: z.string() })]))
      .min(1, "Debes seleccionar al menos un producto para el menú")
      .default([])
  })
  .passthrough()

export const newDishSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.string().min(1, "El precio es requerido"),
  preparationTime: z
    .string({
      required_error: "El tiempo de preparación es requerido",
      invalid_type_error: "El tiempo de preparación debe ser un texto"
    })
    .min(1, "El tiempo de preparación es requerido"),
  taxRate: z.preprocess(
    (val) => {
      if (typeof val === "number") {
        if (val === 0) return "0"
        if (val === 0.15) return "0.15"
        if (val === 0.18) return "0.18"
      }

      if (typeof val === "string") {
        const parsed = Number(val)
        if (parsed === 0) return "0"
        if (parsed === 0.15) return "0.15"
        if (parsed === 0.18) return "0.18"
      }

      return val
    },
    z.enum(["0", "0.15", "0.18"], {
      errorMap: () => ({ message: "El impuesto es requerido" })
    })
  ),
  includesDrink: z.boolean(),

  tags: z
    .array(z.string(), {
      required_error: "Debes seleccionar al menos una categoría",
      invalid_type_error: "Las etiquetas deben ser un arreglo"
    })
    .min(1, "Debes seleccionar al menos una categoría"),

  files: z
    .array(z.instanceof(File), {
      invalid_type_error: "Debes subir una imagen válida",
      required_error: "La imagen del producto es requerida"
    })
    .min(1, "La imagen del producto es requerida")
})

export const editDishSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    price: z.string().min(1, "El precio es requerido"),
    preparationTime: z
      .string({
        required_error: "El tiempo de preparación es requerido",
        invalid_type_error: "El tiempo de preparación debe ser un texto"
      })
      .min(1, "El tiempo de preparación es requerido"),
    taxRate: z.preprocess(
      (val) => {
        if (typeof val === "number") {
          if (val === 0) return "0"
          if (val === 0.15) return "0.15"
          if (val === 0.18) return "0.18"
        }

        if (typeof val === "string") {
          const parsed = Number(val)
          if (parsed === 0) return "0"
          if (parsed === 0.15) return "0.15"
          if (parsed === 0.18) return "0.18"
        }

        return val
      },
      z.enum(["0", "0.15", "0.18"], {
        errorMap: () => ({ message: "El impuesto es requerido" })
      })
    ),

    includesDrink: z.boolean(),

    tags: z.array(z.union([z.string(), z.object({ id: z.string() })])).min(1, "Debes seleccionar al menos una categoría"),

    files: z
      .any()
      .refine(
        (value) =>
          value === undefined || value === null || (Array.isArray(value) && (value.length === 0 || value[0] instanceof File)),
        {
          message: "La imagen del comercio debe ser un archivo válido",
          path: ["files"]
        }
      )
      .optional()
  })
  .passthrough()

export const newBranchSchema = z.object({
  files: z
    .array(z.instanceof(File), {
      invalid_type_error: "Debes subir una imagen válida",
      required_error: "La imagen de la sucursal es requerida"
    })
    .min(1, "La imagen de la sucursal es requerida"),

  state: z.number({
    required_error: "El departamento es requerido",
    invalid_type_error: "El departamento debe ser un número válido"
  }),
  city: z.string().min(1, "La ciudad es requerida"),

  phoneNumber: z
    .string()
    .min(1, "El número de teléfono es requerido")
    .regex(/^(\+504)?\d{8}$/, "Debe tener 8 dígitos, con o sin el prefijo +504"),

  email: z
    .string()
    .min(1, "El correo es requerido")
    .regex(/.+@.+\..+/, "El correo no es válido"),

  address: z.string().min(1, "La dirección es requerida"),
  name: z.string().min(1, "El nombre es requerido"),

  delivery: z.boolean().default(false),
  pickup: z.boolean().default(false),
  onSite: z.boolean().default(false),
  allowTableBooking: z.boolean().default(false),

  maxDistanceShipping: z
    .string()
    .min(1, "La distancia máxima de envío es requerida")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Debe ser un número válido mayor o igual a 0"
    }),

  note: z.string().optional().nullable(),

  geolocation: z
    .array(z.number(), { required_error: "La ubicación es requerida" })
    .length(2, "Debes proporcionar latitud y longitud válidas")
})

const geolocationSchema = z.union([
  z.tuple([z.number(), z.number()]),
  z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()])
  })
])

export const editBranchSchema = z.object({
  files: z
    .array(
      z.union([
        z.instanceof(File),
        z.object({
          path: z.string().min(1, "La imagen debe tener una ruta válida")
        })
      ])
    )
    .optional(),
  state: z.number({
    required_error: "El departamento es requerido",
    invalid_type_error: "El departamento debe ser un número válido"
  }),
  city: z.string().min(1, "La ciudad es requerida"),

  phoneNumber: z
    .string()
    .min(1, "El número de teléfono es requerido")
    .regex(/^(\+504)?\d{8}$/, "Debe tener 8 dígitos, con o sin el prefijo +504"),

  email: z
    .string()
    .min(1, "El correo es requerido")
    .regex(/.+@.+\..+/, "El correo no es válido"),

  address: z.string().min(1, "La dirección es requerida"),
  name: z.string().min(1, "El nombre es requerido"),

  delivery: z.boolean().default(false),
  pickup: z.boolean().default(false),
  onSite: z.boolean().default(false),
  allowTableBooking: z.boolean().default(false),

  maxDistanceShipping: z
    .union([z.string(), z.number()])
    .transform((val) => String(val))
    .refine((val) => val.trim() !== "", {
      message: "La distancia máxima de envío es requerida"
    }),
  note: z.string().optional().nullable(),

  geolocation: geolocationSchema
})

const driverSchema = z.object({
  motorcycleId: z
    .string()
    .min(1, "La placa de la motocicleta es requerida")
    .regex(/^[A-Z]{3}[0-9]{4}$/, "La placa debe tener el formato ABC1234")
    .transform((val) => val.toUpperCase()),
  nationalIdentityNumber: z
    .string()
    .min(1, "El número de identidad es requerido")
    .refine((val) => val.length === 13, {
      message: "El número de identidad debe tener 13 dígitos"
    })
})

export const newUserSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.string().min(1, "El correo es requerido").email("El correo no es válido"),
    phoneNumber: z
      .string()
      .min(1, "El número de teléfono es requerido")
      .regex(/^(\+504)?\d{8}$/, "El número de teléfono debe tener 8 dígitos, con o sin el prefijo +504"),
    role: z.string().min(1, "El rol es requerido"),
    password: z.string().min(1, "La contraseña es requerida"),
    confirmPassword: z.string().min(1, "La confirmación de contraseña es requerida"),
    sucursalIds: z.array(z.string().min(1)).min(1, "La sucursal es requerida"),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida",
        required_error: "La imagen del usuario es requerida"
      })
      .min(1, "La imagen del usuario es requerida"),
    driver: z
      .object({
        value: z.string(),
        label: z.string()
      })
      .optional(),
    Driver: z
      .object({
        motorcycleId: z.string().optional(),
        nationalIdentityNumber: z.string().optional()
      })
      .optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"]
  })
  .superRefine((data, ctx) => {
    if (data.role === "driver") {
      if (!data.Driver) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Los datos del repartidor son requeridos",
          path: ["Driver"]
        })
      } else {
        try {
          driverSchema.parse(data.Driver)
        } catch (err) {
          if (err instanceof z.ZodError) {
            err.errors.forEach((e) => {
              ctx.addIssue({
                code: e.code,
                message: e.message,
                path: ["Driver", ...(e.path || [])]
              })
            })
          }
        }
      }
    }
  })

const featureObjectSchema = z.record(
  z.string().uuid(),
  z
    .object({
      available: z.boolean().optional(),
      quantity: z.preprocess(
        (val) => {
          if (val === "") return undefined
          const num = Number(val)
          return isNaN(num) ? undefined : num
        },
        z
          .number({
            required_error: "La cantidad es requerida",
            invalid_type_error: "La cantidad debe ser un número"
          })
          .int("La cantidad debe ser un número entero")
          .min(1, "La cantidad debe ser mayor que 0")
          .optional()
      )
    })
    .refine(
      (data) => {
        if (data.available === undefined && (data.quantity === undefined || data.quantity <= 0)) {
          return false
        }
        return true
      },
      {
        message: "La cantidad es requerida y debe ser mayor que 0",
        path: ["quantity"]
      }
    )
)

export const newPlanSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z
    .string()
    .min(1, "El precio es requerido")
    .regex(/^\d+(\.\d{1,2})?$/, "Precio inválido"),
  tax: z.preprocess(
    (val) => {
      if (typeof val === "number") return val.toFixed(2)
      if (typeof val === "string") {
        const parsed = Number(val)
        if (!isNaN(parsed)) return parsed.toFixed(2)
        return val
      }
      return undefined
    },
    z.enum(["0.00", "0.15", "0.18"], {
      errorMap: () => ({ message: "El impuesto es requerido" })
    })
  ),
  paymentType: z.preprocess(
    (val) => String(val),
    z.string().refine((val) => ["MENSUAL", "ANUAL"].includes(val), {
      message: "El tipo de pago es requerido"
    })
  ),
  currency: z.preprocess(
    (val) => String(val),
    z.string().refine((val) => ["HNL", "USD"].includes(val), {
      message: "La moneda es requerida"
    })
  ),
  features: featureObjectSchema
})

export const newPromotionSchema = z
  .object({
    allDishes: z.enum(["all", "some"], { required_error: "Este campo es requerido" }),
    category: z.enum(["fijo", "porcentual"], { required_error: "El tipo de descuento es requerido" }),
    percentage: z.string().optional(),
    amount: z.string().optional(),
    startDate: z.date({ required_error: "La fecha de inicio es requerida" }),
    endDate: z.date({ required_error: "La fecha de finalización es requerida" }),
    title: z.string().min(1, "El título es requerido"),
    minPurchase: z
      .string()
      .min(1, "La compra mínima es requerida")
      .regex(/^\d+(\.\d{1,2})?$/, "La compra mínima debe ser un número válido"),
    Dishes: z.array(z.string().uuid()),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida",
        required_error: "La imagen de la promoción es requerida"
      })
      .min(1, "La imagen de la promoción es requerida")
  })
  .superRefine((data, ctx) => {
    if (data.category === "porcentual" && !data.percentage) {
      ctx.addIssue({
        path: ["percentage"],
        code: z.ZodIssueCode.custom,
        message: "El porcentaje es requerido"
      })
    }

    if (data.category === "fijo" && !data.amount) {
      ctx.addIssue({
        path: ["amount"],
        code: z.ZodIssueCode.custom,
        message: "El monto es requerido"
      })
    }

    if (data.allDishes === "some" && (!data.Dishes || data.Dishes.length === 0)) {
      ctx.addIssue({
        path: ["Dishes"],
        code: z.ZodIssueCode.custom,
        message: "Debes seleccionar al menos un platillo"
      })
    }

    if (data.allDishes === "all" && data.Dishes.length > 0) {
      ctx.addIssue({
        path: ["Dishes"],
        code: z.ZodIssueCode.custom,
        message: "No debes seleccionar platillos si el descuento aplica a todos"
      })
    }
  })

export const editPromotionSchema = z
  .object({
    allDishes: z.enum(["all", "some"], {
      required_error: "Este campo es requerido"
    }),
    category: z.enum(["fijo", "porcentual"], {
      required_error: "El tipo de descuento es requerido"
    }),
    percentage: z.string().nullable().optional(),
    amount: z.string().nullable().optional(),
    startDate: z.preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
      z.date({ required_error: "La fecha de inicio es requerida" })
    ),
    endDate: z.preprocess(
      (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
      z.date({ required_error: "La fecha de finalización es requerida" })
    ),
    title: z.string().min(1, "El título es requerido").max(100, "El título no debe superar los 100 caracteres"),
    minPurchase: z
      .string()
      .min(1, "La compra mínima es requerida")
      .regex(/^\d+(\.\d{1,2})?$/, "La compra mínima debe ser un número válido"),
    Dishes: z
      .array(
        z.union([
          z.string().uuid(),
          z.object({
            id: z.string().uuid()
          })
        ])
      )
      .default([]),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida",
        required_error: "La imagen de la promoción es requerida"
      })
      .min(1, "La imagen de la promoción es requerida")
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.category === "porcentual" && !data.percentage) {
      ctx.addIssue({
        path: ["percentage"],
        code: z.ZodIssueCode.custom,
        message: "El porcentaje es requerido"
      })
    }

    if (data.category === "fijo" && !data.amount) {
      ctx.addIssue({
        path: ["amount"],
        code: z.ZodIssueCode.custom,
        message: "El monto es requerido"
      })
    }

    const dishesCount = Array.isArray(data.Dishes) ? data.Dishes.length : 0

    if (data.allDishes === "some" && dishesCount === 0) {
      ctx.addIssue({
        path: ["Dishes"],
        code: z.ZodIssueCode.custom,
        message: "Debes seleccionar al menos un platillo"
      })
    }

    if (data.allDishes === "all" && dishesCount > 0) {
      ctx.addIssue({
        path: ["Dishes"],
        code: z.ZodIssueCode.custom,
        message: "No debes seleccionar platillos si el descuento aplica a todos"
      })
    }
  })

export const newCouponSchema = z
  .object({
    couponType: z.enum(["fecha", "cantidad"], {
      required_error: "El tipo de cupón es requerido"
    }),
    category: z.enum(["fijo", "porcentual"], {
      required_error: "El tipo de descuento es requerido"
    }),
    percentage: z.string().nullable().optional(),
    amount: z.string().nullable().optional(),
    timesToUse: z.string().optional().nullable(),
    startDate: z
      .preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val), z.date().optional())
      .nullable(),
    endDate: z
      .preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val), z.date().optional())
      .nullable(),
    title: z.string().min(1, "El título es requerido").max(100, "El título no debe superar los 100 caracteres"),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida",
        required_error: "La imagen del cupón es requerida"
      })
      .min(1, "La imagen del cupón es requerida")
  })
  .superRefine((data, ctx) => {
    if (data.category === "porcentual" && !data.percentage) {
      ctx.addIssue({
        path: ["percentage"],
        code: z.ZodIssueCode.custom,
        message: "El porcentaje es requerido"
      })
    }

    if (data.category === "fijo" && !data.amount) {
      ctx.addIssue({
        path: ["amount"],
        code: z.ZodIssueCode.custom,
        message: "El monto es requerido"
      })
    }

    if (data.couponType === "fecha") {
      if (!data.startDate) {
        ctx.addIssue({
          path: ["startDate"],
          code: z.ZodIssueCode.custom,
          message: "La fecha de inicio es requerida"
        })
      }
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          code: z.ZodIssueCode.custom,
          message: "La fecha de finalización es requerida"
        })
      }
    }

    if (data.couponType === "cantidad") {
      if (!data.timesToUse || data.timesToUse.trim() === "") {
        ctx.addIssue({
          path: ["timesToUse"],
          code: z.ZodIssueCode.custom,
          message: "La cantidad de usos es requerida"
        })
      } else if (!/^\d+$/.test(data.timesToUse)) {
        ctx.addIssue({
          path: ["timesToUse"],
          code: z.ZodIssueCode.custom,
          message: "Debe ser un número entero"
        })
      }
    }
  })

export const editCouponSchema = z
  .object({
    couponType: z.enum(["fecha", "cantidad"], {
      required_error: "El tipo de cupón es requerido"
    }),
    category: z.enum(["fijo", "porcentual"], {
      required_error: "El tipo de descuento es requerido"
    }),
    percentage: z.string().nullable().optional(),
    amount: z.string().nullable().optional(),
    timesToUse: z.preprocess((val) => {
      if (typeof val === "string") {
        const trimmed = val.trim()
        return trimmed === "" ? undefined : parseInt(trimmed, 10)
      }
      if (typeof val === "number") return val
      return undefined
    }, z.number().int().positive().optional().nullable()),
    startDate: z
      .preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val), z.date().optional())
      .nullable(),
    endDate: z
      .preprocess((val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val), z.date().optional())
      .nullable(),
    title: z.string().min(1, "El título es requerido").max(100, "El título no debe superar los 100 caracteres"),
    files: z
      .array(z.instanceof(File), {
        invalid_type_error: "Debes subir una imagen válida",
        required_error: "La imagen del cupón es requerida"
      })
      .min(1, "La imagen del cupón es requerida")
      .optional()
  })
  .superRefine((data, ctx) => {
    if (data.category === "porcentual" && !data.percentage) {
      ctx.addIssue({
        path: ["percentage"],
        code: z.ZodIssueCode.custom,
        message: "El porcentaje es requerido"
      })
    }

    if (data.category === "fijo" && !data.amount) {
      ctx.addIssue({
        path: ["amount"],
        code: z.ZodIssueCode.custom,
        message: "El monto es requerido"
      })
    }

    if (data.couponType === "fecha") {
      if (!data.startDate) {
        ctx.addIssue({
          path: ["startDate"],
          code: z.ZodIssueCode.custom,
          message: "La fecha de inicio es requerida"
        })
      }
      if (!data.endDate) {
        ctx.addIssue({
          path: ["endDate"],
          code: z.ZodIssueCode.custom,
          message: "La fecha de finalización es requerida"
        })
      }
    }

    if (data.couponType === "cantidad") {
      if (data.timesToUse === undefined || data.timesToUse === null) {
        ctx.addIssue({
          path: ["timesToUse"],
          code: z.ZodIssueCode.custom,
          message: "La cantidad de usos es requerida"
        })
      }
    }
  })

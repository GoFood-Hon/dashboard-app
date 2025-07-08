import * as Yup from "yup"
import { USER_ROLES } from "./constants"

export const inputRequired = {
  required: "Este campo es requerido."
}

export const emailRules = {
  required: "Correo es requerido.",
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Correo incorrecto."
  },
  maxLength: {
    value: 100,
    message: "Correo es demasiado largo."
  }
}

export const passwordRules = {
  required: "Contraseña es requerida.",
  minLength: {
    value: 8,
    message: "Contraseña tiene que tener por lo menos 8 caracteres."
  }
}

export const newAdminValidationSchema = Yup.object().shape({
  name: Yup.string().required("*Campo requerido"),
  email: Yup.string().required("*Campo requerido"),
  phoneNumber: Yup.string().required("*Campo requerido"),
  restaurantId: Yup.string().required("*Campo requerido"),
  password: Yup.string().required("Contraseña es requerida.").min(8, "Contraseña tiene que tener al menos 8 caracteres."),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Confirme su contraseña.")
})

export const passwordValidationSchema = Yup.object().shape({
  password: Yup.string().required("Contraseña es requerida.").min(8, "Contraseña tiene que tener al menos 8 caracteres."),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Confirme su contraseña.")
})

export const resetPasswordValidation = Yup.object().shape({
  currentPassword: Yup.string().required("Contraseña actual es requerida"),
  newPassword: Yup.string().required("Contraseña es requerida.").min(8, "Contraseña tiene que tener al menos 8 caracteres."),
  newPasswordConfirm: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Las contraseñas no coinciden.")
    .required("Confirme su contraseña.")
})

export const registrationValidationSchema = Yup.object().shape({
  name: Yup.string().required("Nombre de usuario es requerido."),
  email: Yup.string().required("Correo es requerido.").email("Correo incorrecto."),
  password: Yup.string().required("Contraseña es requerida.").min(8, "Contraseña tiene que tener al menos 8 caracteres."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Confirme su contraseña.")
})

export const newItemValidationSchema = Yup.object().shape({
  name: Yup.string().required("Nombre del producto es requerido."),
  description: Yup.string().required("Descripción del producto es requerido."),
  price: Yup.string().required("Precio del producto es requerido."),

  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen")
})

export const newComplementValidation = Yup.object().shape({
  name: Yup.string().required("Nombre del complemento es requerido."),
  description: Yup.string().required("Descripción del complemento es requerido."),
  category: Yup.string().required("Categoría es requerida."),
  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen"),
  price: Yup.string().required("Precio es requerido.")
})

export const newMenuValidation = Yup.object().shape({
  name: Yup.string().required("Nombre del menú es requerido."),
  description: Yup.string().required("Descripción del menú es requerido."),
  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen")
})

export const newCollectionValidation = Yup.object().shape({
  name: Yup.string().required("Nombre del menú es requerido."),
  description: Yup.string().required("Descripción del menú es requerido."),
  type: Yup.string().required("Debes seleccionar el tipo de colección"),
  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen")
})

export const newBranchValidation = Yup.object().shape({
  name: Yup.string().required("Nombre de la sucursal es requerido."),
  address: Yup.string().required("Dirección es requerido."),
  email: Yup.string().required("Correo es requerido."),
  phoneNumber: Yup.string().required("Teléfono es requerido."),
  city: Yup.string().required("Ciudad es requerido."),
  state: Yup.string().required("Departamento es requerido."),
  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen")
})

export const filtersValidationSchema = Yup.object().shape({
  startDate: Yup.date().required("*Fecha inicial es requerida"),
  endDate: Yup.date()
    .required("*Fecha final es requerida")
    .min(Yup.ref("startDate"), "*Fecha final no  puede ser antes de la fecha inicial."),
  status: Yup.string().required("*El estado es requerido"),
  startPrice: Yup.number().required("*Precio inicial es requerido").min(0, "*Precio inicial debe ser mayor o igual a 0")
})

export const userValidation = Yup.object().shape({
  firstName: Yup.string().required("*Campo requerido"),
  lastName: Yup.string().required("*Campo requerido"),
  email: Yup.string().required("*Campo requerido"),
  phoneNumber: Yup.string().required("*Campo requerido"),
  role: Yup.string().required("*Campo requerido"),
  password: Yup.string().required("Contraseña es requerida.").min(8, "Contraseña tiene que tener al menos 8 caracteres."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Confirme su contraseña.")
})

// export const restaurantValidation = Yup.object().shape({
//   name: Yup.string().required("El nombre es requerido"),
//   email: Yup.string().email("El correo electrónico no es válido").required("El correo electrónico es requerido"),
//   phoneNumber: Yup
//     .string()
//     .required("El número de teléfono es requerido"),
//   socialReason: Yup.string().required("La razón social es requerida"),
//   rtn: Yup.string().required("El RTN es requerido"),
//   billingAddress: Yup.string().required("La dirección de facturación es requerida"),
//   cai: Yup.string().required("El CAI es requerido"),
//   shippingFree: Yup.boolean().default(false),
//   cuisineTypeId: Yup
//     .number()
//     .required("El ID de tipo de cocina es requerido"),
//   pricePerChair: Yup.number().nullable().min(0, "El precio por silla debe ser un valor positivo").optional(),
//   hoursBeforeCancellation: Yup
//     .number()
//     .nullable()
//     .min(0, "Las horas antes de la cancelación deben ser un valor positivo")
//     .optional(),
//   hoursBeforeBooking: Yup.number().nullable().min(0, "Las horas antes de la reserva deben ser un valor positivo").optional(),
//   shippingPrice: Yup
//     .number()
//     .nullable()
//     .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
//     .when("shippingFree", {
//       is: false,
//       then: Yup
//         .number()
//         .required("El precio de envío es requerido cuando no es gratuito")
//         .min(0, "El precio de envío debe ser un valor positivo"),
//       otherwise: Yup.number().notRequired()
//     }),
//   files: Yup
//     .array()
//     .of(Yup.mixed().test("file", "El archivo es requerido", (value) => value instanceof File))
//     .optional(),
//   bannerDishes: Yup
//     .array()
//     .of(Yup.mixed().test("file", "El archivo es requerido", (value) => value instanceof File))
//     .optional()
// })

export const restaurantValidation = Yup.object().shape({
  name: Yup.string().required("Campo requerido"),
  email: Yup.string().email("Correo no válido").required("Campo requerido"),
  phoneNumber: Yup.string()
    .matches(/^\+504\d{8}$/, "Debe comenzar con +504 y tener 8 dígitos")
    .required("Campo requerido"),
  socialReason: Yup.string().required("Campo requerido"),
  rtn: Yup.string().length(14, "El RTN debe tener 14 caracteres").required("Campo requerido"),
  billingAddress: Yup.string().required("Campo requerido"),
  cai: Yup.string().required("Campo requerido"),
  shippingFree: Yup.boolean().required("Campo requerido"),
  // shippingPrice: Yup.number()
  //   .nullable() // Permite valores nulos
  //   .when("shippingFree", {
  //     is: false, // Evalúa cuando `shippingFree` es falso
  //     then: Yup.number()
  //       .typeError("Debe ser un número válido")
  //       .min(0, "El precio de envío debe ser mayor o igual a 0")
  //       .required("*Campo requerido"),
  //     otherwise: Yup.number().nullable() // Permite nulo si `shippingFree` es verdadero
  //   }),
  cuisineTypeId: Yup.string().required("Campo requerido"),
  clinpaysCommerceToken: Yup.string().nullable(),
  pricePerChair: Yup.number().optional().nullable().typeError("Debe ser un número válido").min(1, "Debe ser mayor a 0"),
  hoursBeforeCancellation: Yup.number().optional().nullable().typeError("Debe ser un número válido").min(1, "Debe ser al menos 1 hora"),
  hoursBeforeBooking: Yup.number().optional().nullable().typeError("Debe ser un número válido").min(1, "Debe ser al menos 1 hora"),
  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen")
})

export const couponsValidationFrom = (componentMounted) => {
  return Yup.object().shape({
    title: Yup.string().required("*Campo requerido"),
    code: Yup.string().required("*Campo requerido"),
    startDate: componentMounted ? Yup.date().required("*Fecha inicial es requerida") : Yup.date(),
    endDate: componentMounted
      ? Yup.date()
          .required("*Fecha final es requerida")
          .min(Yup.ref("startDate"), "*Fecha final no puede ser antes de la fecha inicial.")
      : Yup.date(),
    timesToUse: !componentMounted ? Yup.string().required("*Campo requerido") : Yup.string()
  })
}

export const promotionValidationFrom = (componentMounted) => {
  return Yup.object().shape({
    title: Yup.string().required("*Campo requerido"),
    minPurchase: Yup.string().required("*Campo requerido"),
    startDate: componentMounted ? Yup.date().required("*Fecha inicial es requerida") : Yup.date(),
    endDate: componentMounted
      ? Yup.date()
          .required("*Fecha final es requerida")
          .min(Yup.ref("startDate"), "*Fecha final no puede ser antes de la fecha inicial.")
      : Yup.date(),
    timesToUse: !componentMounted ? Yup.string().required("*Campo requerido") : Yup.string()
  })
}

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
  name: Yup.string().required("Nombre del platillo es requerido."),
  description: Yup.string().required("Descripción del platillo es requerido."),
  price: Yup.string().required("Precio del platillo es requerido."),

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

export const restaurantValidation = Yup.object().shape({
  name: Yup.string().required("*Campo requerido"),
  email: Yup.string().required("*Campo requerido"),
  phoneNumber: Yup.string().required("*Campo requerido"),
  socialReason: Yup.string().required("*Campo requerido"),
  rtn: Yup.string().required("*Campo requerido"),
  billingAddress: Yup.string().required("*Campo requerido"),
  cai: Yup.string().required("*Campo requerido"),
  maxDistanceShipping: Yup.string().required("*Campo requerido"),
  cuisineTypeId: Yup.string().required("*Campo requerido"),
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

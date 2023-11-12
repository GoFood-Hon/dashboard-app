import * as Yup from "yup"

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

export const passwordValidationSchema = Yup.object().shape({
  password: Yup.string().required("Contraseña es requerida.").min(8, "Contraseña tiene que tener al menos 8 caracteres."),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden.")
    .required("Confirme su contraseña.")
})

export const registrationValidationSchema = Yup.object().shape({
  username: Yup.string().required("Nombre de usuario es requerido."),
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
  endPrice: Yup.string().required("Precio final del platillo es requerido."),
  categoryId: Yup.string().required("Categoría es requerida."),
  files: Yup.array().required("Imagen es requerida").min(1, "Debe seleccionar al menos una imagen")
})

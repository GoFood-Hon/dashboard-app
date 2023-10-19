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

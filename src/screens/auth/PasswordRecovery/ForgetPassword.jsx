import React, { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import authApi from "../../../api/authApi"
import EnterEmail from "./EnterEmail"
import SuccessScreen from "./SuccessScreen"
import EnterNewPassword from "./EnterNewPassword"
import EnterSecretCode from "./EnterSecretCode"

export default function ForgetPassword() {
  const [token, setToken] = useState(null)
  const [step, setStep] = useState("enterEmail")

  const handleEmailSubmit = async ({ email }) => {
    try {
      const res = await authApi.forgotPassword({ email })
      if (res.error) {
        toast.error("Hubo un error! ", res?.error?.message)
      }
      if (res.status === "success") {
        toast.success("Token enviado con éxito!")
        setStep("enterSecretCode")
      }
    } catch (err) {
      toast.error("Se ha encontrado un error en su solicitud: ", err)
      return false
    }
  }

  async function handleCodeSubmit({ token }) {
    try {
      const res = await authApi.verifyOTP({ token })
      if (res.error) {
        toast.error("Código Inválido")
        return
      }
      if (res.status === "success") {
        setToken(token)
        toast.success("Código válido. Ingrese nueva contraseña")
        setStep("enterNewPassword")
      }
    } catch (err) {
      toast.error("Se ha encontrado un error en su solicitud: ", err)
      return false
    }
  }

  async function handlePasswordSubmit({ password, passwordConfirm }) {
    try {
      const res = await authApi.resetPassword({ password, passwordConfirm, token })
      if (res.error) {
        toast.error("Hubo un error! ", res?.error?.message)
        return
      }

      if (res.status === "success") {
        toast.success("Contraseña restablecida")
        setStep("success")
      }
    } catch (err) {
      toast.error("Se ha encontrado un error en su solicitud: ", err)
      return false
    }
  }

  return (
    <>
      <div className="w-full">
        <div className=" flex flex-col items-center">
          <h1 className="md:text-3xl text-center text-2xl font-bold text-zinc-800 dark:text-white file">Recuperar contraseña!</h1>
          {step === "enterEmail" && <EnterEmail onSubmit={handleEmailSubmit} />}
          {step === "enterSecretCode" && <EnterSecretCode onSubmit={handleCodeSubmit} />}
          {step === "enterNewPassword" && <EnterNewPassword onSubmit={handlePasswordSubmit} />}
          {step === "success" && <SuccessScreen />}
          <Link
            to={"/login"}
            className="text-center items-center justify-center w-full text-primary_text cursor-pointer dark:text-dark_secondary_text hover:underline font-bold ">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </>
  )
}

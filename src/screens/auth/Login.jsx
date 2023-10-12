import React, { useState } from "react"
import ToggleTheme from "../../components/ToggleTheme"
import LoadingCircle from "../../components/LoadingCircle"
import Google from "../../components/GoogleIcon"
import { Link } from "react-router-dom"
import AuthLayout from "../../layout/AuthLayout"

export default function Login() {
  const [signInClicked, setSignInClicked] = useState(false)

  return (
    <AuthLayout>
      <div>
        <div className=" flex flex-col items-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Iniciar sesion en GoFood</h1>
          <p className="text-sm text-gray-500 pb-5">Inicia sesion con tu cuenta o con alguna red social.</p>
        </div>
        <span className="mb-10 text-slate-400">Correo electronico</span>
        <input
          className="mb-4 mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500"
          type="email"
          placeholder="Ingrese su correo"
        />

        <span className="text-slate-400">Contrasena</span>
        <input
          className="mb-4 mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500"
          type="password"
          placeholder="Ingrese su contrasena"
        />
        <Link to={"/forgetPassword"} className="mb-5 hover:underline hover:cursor-pointer text-sm text-orange-500">
          Olvidaste tu contrasena?
        </Link>
        <button
          className="ml-auto mt-6 mb-3 text-sm h-10 w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-700"
          type="submit">
          Iniciar sesion
        </button>
        <button
          disabled={signInClicked}
          className={`${
            signInClicked
              ? "cursor-not-allowed border-gray-200 bg-gray-100"
              : "border border-gray-200 bg-white text-black hover:bg-gray-50"
          } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none mb-3`}
          onClick={() => {
            setSignInClicked(true)
          }}>
          {signInClicked ? (
            <LoadingCircle />
          ) : (
            <>
              <Google className="h-5 w-5" />
              <p>Iniciar sesion con Google</p>
            </>
          )}
        </button>
        <div className="w-full flex flex-col items-center justify-center text-sm text-gray-500">
          <div className="flex flex-row justify-center w-full mb-3">
            <p>No tienes una cuenta?</p>
            <Link to={"/register"} className="hover:underline text-orange-500 cursor-pointer pl-1">
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

import React from "react"
import { Link } from "react-router-dom"

export default function ForgetPassword() {
  return (
    <>
      <div>
        <div className=" flex flex-col items-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Recuperar contrasena!</h1>
          <p className="text-sm text-gray-500 pb-5 mt-2 text-center">
            Ingrese su correo y siga las instrucciones que se enviaran a su correo.
          </p>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400">Email</span>
          <input
            className="mb-4 mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500"
            type="email"
            placeholder="Enter your email"
          />
          <button
            className="ml-auto my-2 text-sm h-10 w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-700"
            type="submit">
            Enviame el correo
          </button>
          <Link
            to={"/login"}
            className=" text-center items-center justify-center w-full text-orange-500 hover:underline font-bold">
            Iniciar sesion
          </Link>
        </div>
      </div>
    </>
  )
}

import React, { useState } from "react"
import ToggleTheme from "../../components/ToggleTheme"
import LoadingCircle from "../../components/LoadingCircle"
import Google from "../../components/GoogleIcon"

export default function Login() {
  const [signInClicked, setSignInClicked] = useState(false)

  return (
    <div className="w-screen h-screen flex flex-col justify-center align-middle items-center dark:bg-slate-900 bg-slate-100 text-black dark:text-white">
      <div className="w-full p-5  xl:w-3/6 2xl:w-2/6  lg:w-3/6 md:w-4/5 sm:w-5/6 py-10 xs:w-full xs:rounded-none bg-white dark:bg-slate-800 dark:border-slate-700 drop-shadow-xl shadow-slate-100 overflow-x-hidden shadow-xl md:rounded-2xl border border-gray-200 dark:shadow-slate-800">
        <div className="md:p-10 xs:p-10 items-center justify-center flex dark:text-white">
          <div className="border-red-500 ">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white file">Iniciar sesion en GoFood</h1>
            <p className="text-sm text-gray-500 pb-5">Inicia sesion con tu cuenta o con alguna enlace social.</p>
            <span className="mb-10 text-slate-400">Email</span>
            <input
              className="mb-4 mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500"
              type="text"
              placeholder="Enter your email"
            />
            <span className="text-slate-400">Password</span>
            <input
              className="mb-4 mt-2 p-2 appearance-none block w-full border placeholder-gray-300 rounded focus:outline-none dark:bg-slate-900 dark:border-gray-600 dark:placeholder-gray-500"
              type="password"
              placeholder="Enter your password"
            />
            <a className="mb-5 hover:underline hover:cursor-pointer text-sm text-orange-500">Olvidaste tu contrasena?</a>
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
                <a className="hover:underline text-orange-500 cursor-pointer pl-1">Crear cuenta</a>
              </div>
              <ToggleTheme className="font-bold" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

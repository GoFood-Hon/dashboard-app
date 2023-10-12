import React from "react"
import ToggleTheme from "./components/ToggleTheme"
import Login from "./screens/auth/Login"

function App() {
  return (
    <>
      {/*  <div className="flex flex-col justify-center items-center h-screen dark:bg-black dark:text-white bg-white text-black">
        <span>Hello 🖐️</span>
        <ToggleTheme />
      </div> */}
      <Login />
    </>
  )
}

export default App

import React from "react"
import ToggleTheme from "./layout/ToggleTheme"

function App() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen dark:bg-black dark:text-white bg-white text-black">
        <span>Hello 🖐️</span>
        <ToggleTheme />
      </div>
    </>
  )
}

export default App

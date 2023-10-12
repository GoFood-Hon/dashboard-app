import React, { useEffect, useState } from "react"

function ToggleTheme({ className }) {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("html").classList.add("dark")
    } else {
      document.querySelector("html").classList.remove("dark")
    }
  }, [theme])

  const handleChangeTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }
  return (
    <div className={className}>
      <a className="hover:cursor-pointer" onClick={handleChangeTheme}>
        {theme === "dark" ? "☀️  Light theme" : "🌑 Dark theme"}
      </a>
    </div>
  )
}

export default ToggleTheme

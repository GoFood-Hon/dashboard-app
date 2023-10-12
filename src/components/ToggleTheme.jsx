import React from "react"
import { useTheme } from "../context/ThemeProvider"

function ToggleTheme({ className }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={className}>
      <a className="hover:cursor-pointer" onClick={toggleTheme}>
        {theme === "dark" ? "☀️ Light theme" : "🌑 Dark theme"}
      </a>
    </div>
  )
}

export default ToggleTheme

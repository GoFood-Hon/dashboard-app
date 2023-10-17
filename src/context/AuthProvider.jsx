import React, { createContext, useState } from "react"

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState("Campero")

  return (
    <AuthContext.Provider
      value={{
        restaurant
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

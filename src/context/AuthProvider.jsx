import React, { createContext, useState, useEffect } from "react"

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(true)
  const [restaurant, setRestaurant] = useState("Campero")

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        restaurant
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

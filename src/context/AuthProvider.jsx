import React, { createContext, useState, useEffect } from "react"

const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(true)

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

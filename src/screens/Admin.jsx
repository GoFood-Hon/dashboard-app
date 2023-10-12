import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider"

function Admin() {
  const { user, setUser } = useContext(AuthContext)

  return (
    <div>
      <h1>Admin</h1>
      <Link to="/" replace>
        <button>Back to Home</button>
      </Link>
      <button onClick={() => setUser(false)}>Logout</button>
    </div>
  )
}
export default Admin

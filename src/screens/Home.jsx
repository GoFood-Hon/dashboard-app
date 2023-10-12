import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider"

function Home() {
  const { user, setUser } = useContext(AuthContext)

  return (
    <div>
      <h1>Homepage</h1>
      <Link to="/admin" replace>
        <button>Admin Page</button>
      </Link>
      <button onClick={() => setUser(false)}>Logout</button>
    </div>
  )
}

export default Home

import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider"
import Header from "../components/Header"

function Home() {
  const { setUser } = useContext(AuthContext)

  return (
    <div className="w-full h-screen dark:bg-slate-900 bg-slate-100 text-black dark:text-white">
      <Header />
      <h1>Homepage</h1>
      <Link to="/admin" replace>
        <button>Admin Page</button>
      </Link>
      <button onClick={() => setUser(false)}>Logout</button>
    </div>
  )
}

export default Home

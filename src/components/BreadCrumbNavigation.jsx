import React from "react"
import { Link } from "react-router-dom"

export default function BreadCrumbNavigation({ location }) {
  const breadcrumbItems = location.pathname.split("/").filter((path) => path)

  return (
    <div>
      {breadcrumbItems.map((item, index) => (
        <Link to={`/${breadcrumbItems.slice(0, index + 1).join("/")}`} key={index}>
          <span className="md:text-sm xs:text-xs case capitalize">{item} / </span>
        </Link>
      ))}
    </div>
  )
}

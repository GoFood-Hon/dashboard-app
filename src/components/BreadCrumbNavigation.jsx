import React from "react"
import { Link } from "react-router-dom"

export default function BreadCrumbNavigation({ location, dynamicRoute }) {
  const breadcrumbItems = location.pathname.split("/").filter((path) => path)

  // Regular expression to check if a path is an ID (here it's assuming UUID format)
  const isId = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i

  // Filter out the entries that look like IDs
  const filteredItems = breadcrumbItems.filter((item) => !isId.test(item))

  // If dynamicRoute exists and doesn't look like an ID, append it to the breadcrumb
  if (dynamicRoute && !isId.test(dynamicRoute)) {
    filteredItems.push(dynamicRoute)
  }

  return (
    <div>
      {filteredItems.map((item, index) => (
        // Check if it is the last item to prevent rendering as a link
        <span key={index}>
          {index === filteredItems.length - 1 ? (
            <span className="md:text-sm xs:text-xs case capitalize">{item}</span>
          ) : (
            <Link to={`/${filteredItems.slice(0, index + 1).join("/")}`} key={index}>
              <span className="md:text-sm xs:text-xs case capitalize">{item} / </span>
            </Link>
          )}
        </span>
      ))}
    </div>
  )
}

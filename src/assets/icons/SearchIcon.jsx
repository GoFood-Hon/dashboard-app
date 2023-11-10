import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="#6d7177" {...props}>
    <path
      fill="#6d7177"
      fillRule="evenodd"
      d="M8.25 3a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5ZM1.5 8.25a6.75 6.75 0 1 1 13.5 0 6.75 6.75 0 0 1-13.5 0Z"
      clipRule="evenodd"
    />
    <path
      fill="#6d7177"
      fillRule="evenodd"
      d="M11.957 11.957a.75.75 0 0 1 1.06 0l3.263 3.263a.75.75 0 1 1-1.06 1.06l-3.263-3.262a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
)
export { SvgComponent as SearchIcon }

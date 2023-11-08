import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    {...props}
  >
    <g fill="#00050A" clipPath="url(#a)">
      <path d="M3.02 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM9.77 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM16.52 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.77 0h18v18h-18z" />
      </clipPath>
    </defs>
  </svg>
)
export { SvgComponent as MoreIcon }

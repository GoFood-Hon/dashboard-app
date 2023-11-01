import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <g fill="#fff" fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <path d="M5.265 1.426a.583.583 0 0 1 .485-.26h3.5c.195 0 .377.098.485.26l.994 1.49h2.021a1.75 1.75 0 0 1 1.75 1.75v6.417a1.75 1.75 0 0 1-1.75 1.75H2.25a1.75 1.75 0 0 1-1.75-1.75V4.666a1.75 1.75 0 0 1 1.75-1.75h2.021l.994-1.49Zm.797.907-.993 1.49a.583.583 0 0 1-.486.26H2.25a.583.583 0 0 0-.583.583v6.417a.583.583 0 0 0 .583.583h10.5a.583.583 0 0 0 .583-.583V4.666a.583.583 0 0 0-.583-.583h-2.333a.583.583 0 0 1-.486-.26l-.993-1.49H6.062Z" />
      <path d="M7.5 5.833a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm-2.917 1.75a2.917 2.917 0 1 1 5.834 0 2.917 2.917 0 0 1-5.834 0Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.5 0h14v14H.5z" />
      </clipPath>
    </defs>
  </svg>
)
export { SvgComponent as CameraIcon }

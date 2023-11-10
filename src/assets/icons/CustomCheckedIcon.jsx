import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <g fill="#00050A">
      <path d="m5.077 0-5 5h10l-5-5ZM5.077 14l5-5h-10l5 5Z" />
    </g>
  </svg>
)
export { SvgComponent as CustomCheckedIcon }

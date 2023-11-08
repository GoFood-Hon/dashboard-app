import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 14 16" {...props}>
    <g fill="#6D7177">
      <path d="M7.575 3V1.575h1.35c.3 0 .575-.25.575-.575a.566.566 0 0 0-.575-.575H5.1c-.3 0-.575.25-.575.575 0 .325.25.575.575.575h1.35V3C3.225 3.3.7 6 .7 9.275c0 3.475 2.825 6.3 6.3 6.3 3.475 0 6.3-2.825 6.3-6.3C13.3 6 10.775 3.3 7.575 3ZM7 14.45a5.185 5.185 0 0 1-5.175-5.175A5.185 5.185 0 0 1 7 4.1a5.185 5.185 0 0 1 5.175 5.175A5.185 5.185 0 0 1 7 14.45Z" />
      <path d="M10.175 8.7h-2.6V6.1c0-.3-.25-.575-.575-.575-.3 0-.575.25-.575.575v2.625h-.7c-.3 0-.575.25-.575.575 0 .325.25.575.575.575h.7v.7c0 .3.25.575.575.575.3 0 .575-.25.575-.575v-.7H10.2c.3 0 .575-.25.575-.575 0-.325-.275-.6-.6-.6Z" />
    </g>
  </svg>
)
export { SvgComponent as TimerIcon }
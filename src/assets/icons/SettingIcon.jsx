import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <g fill="#6D7177" fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
      <path d="M8.25 3a.75.75 0 0 1-.75.75H2.25a.75.75 0 1 1 0-1.5H7.5a.75.75 0 0 1 .75.75ZM16.5 3a.75.75 0 0 1-.75.75H10.5a.75.75 0 0 1 0-1.5h5.25a.75.75 0 0 1 .75.75ZM9.75 9a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1 0-1.5H9a.75.75 0 0 1 .75.75ZM16.5 9a.75.75 0 0 1-.75.75H12a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 .75.75ZM6.75 15a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 .75.75ZM16.5 15a.75.75 0 0 1-.75.75H9a.75.75 0 0 1 0-1.5h6.75a.75.75 0 0 1 .75.75Z" />
      <path d="M7.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 7.5 0ZM12 6a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 12 6ZM6 12a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 6 12Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M18 0v18H0V0z" />
      </clipPath>
    </defs>
  </svg>
)
export { SvgComponent as SettingIcon }

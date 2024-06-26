import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" {...props}>
    <g fill="#00050A" clipPath="url(#a)">
      <path d="M9.538 14.822c-5.568 0-8.325-5.316-8.437-5.54a.657.657 0 0 1 0-.563c.112-.225 2.869-5.513 8.437-5.513 5.57 0 8.325 5.288 8.438 5.513a.656.656 0 0 1 0 .562c-.113.225-2.869 5.54-8.438 5.54ZM2.395 9c.618 1.04 3.037 4.556 7.143 4.556 4.107 0 6.525-3.515 7.144-4.556-.619-1.04-3.037-4.556-7.144-4.556-4.106 0-6.525 3.515-7.143 4.556Z" />
      <path d="M9.538 11.39A2.389 2.389 0 0 1 7.148 9a2.389 2.389 0 0 1 2.39-2.39A2.389 2.389 0 0 1 11.93 9a2.389 2.389 0 0 1-2.39 2.39Zm0-3.515c-.618 0-1.125.506-1.125 1.125s.507 1.125 1.125 1.125c.62 0 1.126-.506 1.126-1.125s-.507-1.125-1.126-1.125Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.538 0h18v18h-18z" />
      </clipPath>
    </defs>
  </svg>
)
export { SvgComponent as EyeIcon }

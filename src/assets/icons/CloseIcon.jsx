import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={18} fill="none" {...props}>
    <path
      fill="#00050A"
      d="m9.99 9 6.863-6.862a.628.628 0 0 0 0-.9.628.628 0 0 0-.9 0L9.091 8.1 2.228 1.238a.628.628 0 0 0-.9 0 .628.628 0 0 0 0 .9L8.191 9l-6.863 6.863a.628.628 0 0 0 0 .9.664.664 0 0 0 .45.196.56.56 0 0 0 .45-.197L9.091 9.9l6.862 6.862a.664.664 0 0 0 .45.197.56.56 0 0 0 .45-.197.628.628 0 0 0 0-.9L9.991 9Z"
    />
  </svg>
)
export { SvgComponent as CloseIcon }

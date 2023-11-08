import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
    <path
      fill="#00050A"
      d="M15.75 8.381H3.74l4.782-4.865a.628.628 0 0 0 0-.9.628.628 0 0 0-.9 0L1.8 8.522a.628.628 0 0 0 0 .9l5.822 5.906a.664.664 0 0 0 .45.197.69.69 0 0 0 .45-.169.628.628 0 0 0 0-.9l-4.753-4.81H15.75a.624.624 0 0 0 .619-.618.63.63 0 0 0-.619-.647Z"
    />
  </svg>
)
export { SvgComponent as ArrowLeftIcon }

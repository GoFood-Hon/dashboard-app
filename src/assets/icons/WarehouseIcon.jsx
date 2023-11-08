import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 19 18" {...props}>
    <g fill="#6D7177" clipPath="url(#a)">
      <path d="M18.16 7.734V6.441c0-.647-.337-1.238-.872-1.547L10.595.844a1.828 1.828 0 0 0-1.856 0L2.045 4.866a1.854 1.854 0 0 0-.872 1.547v9.168c0 1.013.816 1.8 1.8 1.8H16.36c1.013 0 1.829-.815 1.829-1.8l-.029-7.847c.029 0 0 0 0 0 .029 0 0 0 0 0ZM2.692 5.963 9.385 1.94a.543.543 0 0 1 .282-.085c.084 0 .197.028.28.085l6.695 4.022a.553.553 0 0 1 .253.478v.675H2.439V6.44c0-.225.084-.394.253-.478Zm4.922 7.03h4.106v1.21H7.614v-1.21Zm4.106-1.265H7.614v-.9c0-.112.084-.225.225-.225h3.684c.112 0 .225.085.225.225v.9h-.028Zm-4.106 4.416v-.675h4.106v.675H7.614Zm8.746 0h-3.375V10.8a1.5 1.5 0 0 0-1.49-1.49H7.839a1.5 1.5 0 0 0-1.491 1.49v5.344H2.973a.534.534 0 0 1-.534-.535V8.353h14.484v7.228c-.028.31-.253.563-.563.563Z" />
      <path d="M8.064 6.019h3.178a.654.654 0 0 0 .646-.647.636.636 0 0 0-.646-.647H8.064a.654.654 0 0 0-.647.647c0 .366.309.647.647.647Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#6D7177" d="M.667 0h18v18h-18z" />
      </clipPath>
    </defs>
  </svg>
)
export { SvgComponent as WarehouseIcon }

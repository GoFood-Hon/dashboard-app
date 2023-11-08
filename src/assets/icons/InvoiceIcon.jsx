import * as React from "react"
const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none" viewBox="0 0 20 24" {...props}>
    <path
      fill="currentColor"
      d="M19.113 3.263A2.633 2.633 0 0 0 16.488.638H3.513A2.633 2.633 0 0 0 .888 3.263v18.825c0 .3.187.6.45.75.262.15.6.112.862-.038l1.875-1.238 2.513 1.65c.3.188.637.188.937 0L10 21.563l2.475 1.65c.15.113.3.15.45.15.15 0 .337-.037.45-.15l2.475-1.65 1.875 1.275a.8.8 0 0 0 .862.038.9.9 0 0 0 .45-.75l.076-18.862Zm-2.4 16.8a1.41 1.41 0 0 0-1.613 0l-2.137 1.425-2.138-1.425c-.262-.15-.525-.263-.825-.263-.262 0-.562.075-.787.262l-2.138 1.425-2.137-1.424a1.41 1.41 0 0 0-1.613 0l-.712.45V3.262c0-.525.412-.938.937-.938h13.012c.525 0 .938.413.938.938v17.25l-.788-.45Z"
    />
    <path
      fill="currentColor"
      d="M8.575 4.987H5.35a.832.832 0 0 0-.825.825c0 .45.375.825.825.825h3.225c.45 0 .825-.375.825-.825a.832.832 0 0 0-.825-.825ZM14.463 4.987h-.9a.832.832 0 0 0-.825.825c0 .45.375.825.825.825h.9c.45 0 .825-.375.825-.825a.832.832 0 0 0-.825-.825ZM5.35 11.588h2.063c.45 0 .825-.375.825-.825a.832.832 0 0 0-.825-.825H5.35a.832.832 0 0 0-.825.824c0 .45.338.825.825.825ZM14.463 9.9h-.9a.832.832 0 0 0-.825.825c0 .45.375.825.825.825h.9c.45 0 .825-.375.825-.825a.832.832 0 0 0-.825-.825ZM8.575 14.775H5.35a.832.832 0 0 0-.825.825c0 .45.375.825.825.825h3.225c.45 0 .825-.375.825-.825a.832.832 0 0 0-.825-.825ZM14.463 14.775h-.9a.832.832 0 0 0-.825.825c0 .45.375.825.825.825h.9c.45 0 .825-.375.825-.825a.832.832 0 0 0-.825-.825Z"
    />
  </svg>
)
export { SvgComponent as InvoiceIcon }
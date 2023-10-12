import React from "react"
import { ReactSVG } from "react-svg"

export const iconComponents = {
  google: <ReactSVG src={"src/assets/icons/google.svg"} />,
  facebook: <ReactSVG src={"src/assets/icons/facebook.svg"} />,
  apple: <ReactSVG src={"src/assets/icons/apple.svg"} />
}

export const Icon = (props) => {
  const { icon, color, size, style, containerStyle, isPressable = false, className } = props

  const Wrapper = isPressable ? "a" : "div"

  const iconComponent = React.cloneElement(iconComponents[icon], {
    width: size,
    height: size,
    style: { color, ...style }
  })

  return (
    <Wrapper className={className} style={containerStyle}>
      {iconComponent}
    </Wrapper>
  )
}

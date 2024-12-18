import { Image, Flex } from "@mantine/core"
import classes from "./AdminHeader.module.css"
import { UserButton } from "../UserButton/UserButton"
import { fetchRestaurantData } from "../../store/features/restaurantSlice"
import { useDispatch, useSelector } from "react-redux"
import { APP_ROLES } from "../../utils/constants"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "@mantine/hooks"
import logoImage from "../../assets/images/colorFUDGOLetters.png"

export function AdminHeader({ burger }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const isSmallScreen = useMediaQuery("(max-width: 430px)")

  useEffect(() => {
    if (user.role === APP_ROLES.restaurantAdmin) {
      dispatch(
        fetchRestaurantData({
          restaurantId: user?.restaurantId
        })
      )
    }
  }, [])

  return (
    <header className={classes.header}>
      <Flex align='center' gap={isSmallScreen ? 5 : 10}>
        {burger && burger}
        <Image
          style={{ cursor: "pointer" }}
          src={logoImage}
          w={isSmallScreen ? 65 : 90}
          fit="contain"
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          onClick={() => navigate("/")}
        />
        {user.role !== APP_ROLES.superAdmin ? (
          <Image
            src={user?.Restaurant?.images?.[0]?.location}
            h={isSmallScreen ? 35 : 45}
            w={isSmallScreen ? 35 : 45}
            radius={"md"}
            fit="contain"
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
        ) : null}
      </Flex>

      <Flex justify="end" align="center" gap={18}>
        <UserButton image={user?.images?.[0]?.location} name={user.name} email={user.email} role={user.role} />
      </Flex>
    </header>
  )
}

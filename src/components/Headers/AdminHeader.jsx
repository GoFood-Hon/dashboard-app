import { ActionIcon, Image, Flex } from "@mantine/core"
import { IconSun, IconMoon } from "@tabler/icons-react"
import classes from "./AdminHeader.module.css"
import { useMantineColorScheme } from "@mantine/core"
import { UserButton } from "../UserButton/UserButton"
import { fetchRestaurantData, selectImage } from "../../store/features/restaurantSlice"
import { useDispatch, useSelector } from "react-redux"
import { APP_ROLES } from "../../utils/constants"
import { useEffect } from "react"
import { colors } from "../../theme/colors"
import { useNavigate } from "react-router-dom"

export function AdminHeader({ burger }) {
  const navigate = useNavigate()
  const imgUrl = useSelector(selectImage)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const { colorScheme, setColorScheme } = useMantineColorScheme()

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark")
  }

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
      {burger && burger}
      <Flex gap={10}>
        <Image
          style={{ cursor: "pointer" }}
          src="https://tkdmymipjaevgekdbsgz.supabase.co/storage/v1/object/public/user_profiles/goFood.png?t=2024-07-30T01%3A25%3A16.174Z"
          w={110}
          fit="contain"
          fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          onClick={() => navigate("/")}
        />
        {user.role !== APP_ROLES.superAdmin ? (
          <Image
            src={imgUrl}
            h={45}
            w={45}
            radius={"md"}
            fit="contain"
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
          />
        ) : null}
      </Flex>

      <Flex justify="end" align="center" gap={18}>
        <ActionIcon
          onClick={() => {
            toggleColorScheme()
          }}
          variant="subtle"
          color={colors.main_app_color}>
          {colorScheme === "dark" ? <IconSun size="1.25rem" /> : <IconMoon size="1.25rem" />}
        </ActionIcon>
        <UserButton image={user?.images?.[0]?.location} name={user.name} email={user.email} />
      </Flex>
    </header>
  )
}

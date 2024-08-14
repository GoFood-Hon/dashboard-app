import React, { useEffect, useState } from "react"
import Button from "./Button"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { Image, Popover, Transition } from "@mantine/core"
import GoFoodLogo from "../assets/images/goFood.png"
import { AUTH_NAVIGATION_ROUTES, NAVIGATION_ROUTES_BRANCH_ADMIN, SETTING_NAVIGATION_ROUTES } from "../routes"
import toast from "react-hot-toast"
import { ConfigIcon } from "../assets/icons/ConfigIcon"
import { fetchRestaurantData, selectImage } from "../store/features/restaurantSlice"
import { APP_ROLES } from "../utils/constants"

export default function Header() {
  const imgUrl = useSelector(selectImage)
  const user = useSelector((state) => state.user.value)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (user.role === APP_ROLES.restaurantAdmin) {
      dispatch(
        fetchRestaurantData({
          restaurantId: user?.restaurantId
        })
      )
    }
    // TODO: 2nd - add branch to fetch data
    /*  else if (
      user.role === APP_ROLES.branchAdmin ||
      user.role === APP_ROLES.kitchenUser ||
      user.role === APP_ROLES.cashierUser
    ) {
      dispatch(
        fetchBranchData({
          branchId: user?.sucursalId
        })
      )
    } */
  }, [])

  useEffect(() => {
    if (location.pathname === AUTH_NAVIGATION_ROUTES.Logout.path) {
      localStorage.removeItem("token")
      navigate(AUTH_NAVIGATION_ROUTES.Login.path)
    }
  }, [location.pathname])

  const logout = () => {
    localStorage.removeItem("token")
    navigate(AUTH_NAVIGATION_ROUTES.Login.path)
  }

  const handleAccount = () => {
    let route = ""
    switch (user.role) {
      case APP_ROLES.superAdmin:
        route = NAVIGATION_ROUTES_BRANCH_ADMIN.Account.path
        break
      case APP_ROLES.restaurantAdmin:
        route = SETTING_NAVIGATION_ROUTES.Cuenta.path
        break
      case APP_ROLES.branchAdmin:
        route = NAVIGATION_ROUTES_BRANCH_ADMIN.Account.path
        break
      case APP_ROLES.cashierUser:
        route = SETTING_NAVIGATION_ROUTES.Cuenta.path
        break
      case APP_ROLES.kitchenUser:
        route = NAVIGATION_ROUTES_BRANCH_ADMIN.Account.path
        break
      default:
        route = "/"
        break
    }
    navigate(route)
    setOpened(false)
  }

  return (
    <div className="w-full p-2 flex flex-row justify-between text-black  bg-white dark:text-white dark:bg-slate-800 dark:border-slate-700 border border-slate-200 z-20 fixed">
      <div className="flex flex-row">
        <div className={`cursor-pointer ${user.role === "admin-restaurant" ? "border-r-2 border-r-gray-300 pr-4" : null}`}>
          <Image
            src={GoFoodLogo}
            h={50}
            w={90}
            fit="contain"
            fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="pl-4">
          {user.role !== APP_ROLES.superAdmin ? (
            <Image
              src={imgUrl}
              h={50}
              w={50}
              radius={"md"}
              fit="contain"
              fallbackSrc="https://placehold.co/600x400?text=Imagen+no+disponible"
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-row text-sm items-center">
        <span className="mx-1 hover:bg-light_selected_element p-2 rounded-full cursor-pointer duration-500 dark:hover:bg-dark_selected_element"></span>
        <span
          className="hover:bg-light_selected_element p-2 rounded-full cursor-pointer duration-500 dark:hover:bg-dark_selected_element"
          onClick={handleAccount}>
          <ConfigIcon />
        </span>
        <div className="flex flex-col items-end px-3">
          <div className="font-semibold">{user.name}</div>
          <div className="text-gray-400">{user.email}</div>
        </div>
        <Popover
          width={250}
          withArrow
          shadow="md"
          position="bottom-end"
          offset={{ mainAxis: 10, crossAxis: -10 }}
          arrowSize={12}
          opened={opened}
          onChange={setOpened}>
          <Popover.Target>
            <button aria-label="Update dimensions">
              <Image
                h={40}
                w={40}
                fit="cover"
                radius="xl"
                src={user?.images?.[0]?.location}
                fallbackSrc="https://placehold.co/60x40?text=Imagen+no+disponible"
                onClick={() => setOpened((o) => !o)}
              />
            </button>
          </Popover.Target>
          <Popover.Dropdown>
            <Transition mounted={opened} transition="slide-left" duration={400} timingFunction="ease-in-out">
              {(styles) => (
                <div className="p-3" style={styles}>
                  <div className="flex flex-col gap-2.5 justify-center items-center">
                    <div className="rounded-full">
                      <Image
                        h={70}
                        w={70}
                        radius="md"
                        fit="contain"
                        src={user?.images?.[0]?.location}
                        fallbackSrc="https://placehold.co/60x40?text=Imagen+no+disponible"
                        onClick={() => setOpened((o) => !o)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-gray-400 text-sm">{user.email}</div>
                  </div>
                  <Button
                    onClick={handleAccount}
                    text={"Manejar cuenta"}
                    className={"mt-5 border border-slate-400 rounded text-sm"}
                    full
                  />
                  <div className="mt-3 dark:border-slate-100 border-slate-400 rounded text-sm bg-slate-700 text-white flex h-10 w-full items-center justify-center space-x-3 shadow-sm transition-all duration-700 focus:outline-none mb-3 cursor-pointer">
                    <span onClick={logout}>Cerrar sesión</span>
                  </div>
                </div>
              )}
            </Transition>
          </Popover.Dropdown>
        </Popover>
      </div>
    </div>
  )
}

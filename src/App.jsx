import React from "react"
import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_RES_ADMIN,
  NAVIGATION_ROUTES_BRANCH_ADMIN,
  NAVIGATION_ROUTES_SUPER_ADMIN,
  SETTING_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_KITCHEN
} from "./routes"
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import AuthLayout from "./layout/AuthLayout"

import Login from "./screens/auth/Login"
import UnauthenticatedLayout from "./layout/UnauthenticatedLayout"
import Register from "./screens/auth/Register"
import ForgetPassword from "./screens/auth/PasswordRecovery/ForgetPassword"
import Home from "./screens/Home"
import Orders from "./screens/Orders/OrdersScreen"
import Transactions from "./screens/Transactions"
import Menu from "./screens/Menu/Menu"

import Branches from "./screens/Branches/Branches"
import Users from "./screens/Users/Users"
import Logout from "./screens/Logout"
import Dishes from "./screens/Dishes/DishesScreen"
import NewDish from "./screens/Dishes/NewDishScreen"
import DishDetails from "./screens/Dishes/DishDetails"
import ComplementsDetails from "./screens/Complements/ComplementsDetails"
import NewComplement from "./screens/Complements/NewComplement"
import Complements from "./screens/Complements/Complements"
import NewMenu from "./screens/Menu/NewMenu"
import NewBranch from "./screens/Branches/NewBranch"
import BranchesDetails from "./screens/Branches/BranchesDetails"
import NewUser from "./screens/Users/NewUser"
import GeneralSettings from "./screens/Users/GeneralSettings"
import AccountSettings from "./screens/Users/AccountSettings"
import PasswordSettings from "./screens/Users/PasswordSettings"
import BusinessSettings from "./screens/Users/BusinessSettings"
import CouponsSettings from "./screens/Users/CouponsSettings"
import BankSettings from "./screens/Users/BankSettings"
import PlanSettings from "./screens/Users/PlanSettings"
import AdministrativeSettings from "./screens/Users/AdministrativeSettings"
import MenuDetails from "./screens/Menu/MenuDetails"
import UserDetails from "./screens/Users/UserDetails"
import { OrderDetails } from "./screens/Orders/OrderDetails"
import RestaurantsScreen from "./screens/Restaurants/RestaurantsScreen"
import PrivateRoute from "./layout/PrivateRoute"
import { useSelector } from "react-redux"
import { APP_ROLES } from "./utils/constants"
import { RestaurantDetailScreen } from "./screens/Restaurants/RestaurantDetailScreen"
import { NewAdminUser } from "./screens/Users/NewAdminUser"
import { AdminUserScreen } from "./screens/Users/AdminUserScreen"
import { AdminUserDetails } from "./screens/Users/AdminUserDetails"
import { NewRestaurant } from "./screens/Restaurants/NewRestaurant"
import { Plans } from "./screens/Plans/Plans"
import { NotFound } from "./screens/NotFound"
import { WelcomeScreen } from "./screens/Welcome/WelcomeScreen"
import { NewPlan } from "./screens/Plans/NewPlan"
import { PlanDetails } from "./screens/Plans/PlanDetails"

import { OrderHistory } from "./screens/Orders/OrderHistory"
import { OrderHistoryDetails } from "./screens/Orders/OrderHistoryDetails"

function App() {
  const userRole = useSelector((state) => state.user.value.role)

  const renderRoutesForRole = (role) => {
    switch (role) {
      case APP_ROLES.superAdmin:
        return (
          <>
            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Dashboard.path} element={<Home />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.path} element={<RestaurantsScreen />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.NewRestaurant.path} element={<NewRestaurant />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.RestaurantDetails.path} element={<RestaurantDetailScreen />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Users.path} element={<AdminUserScreen />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path} element={<NewAdminUser />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Users.UserDetails.path} element={<AdminUserDetails />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path} element={<Plans />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Plans.NewPlan.path} element={<NewPlan />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Plans.PlanDetails.path} element={<PlanDetails />} />
          </>
        )
      case APP_ROLES.restaurantAdmin:
        return (
          <>
            {/* Main routes */}

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Dashboard.path} element={<Home />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path} element={<Orders />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Pedidos.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.path} element={<Menu />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.MenuDetails.path} element={<MenuDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.NewMenu.path} element={<NewMenu />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path} element={<Dishes />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.DishDetails.path} element={<DishDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.NewDish.path} element={<NewDish />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Complements.path} element={<Complements />} />

            <Route
              path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Complements.ComplementDetails.path}
              element={<ComplementsDetails />}
            />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Complements.NewComplement.path} element={<NewComplement />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Transactions.path} element={<Transactions />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Branches.path} element={<Branches />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Branches.NewBranch.path} element={<NewBranch />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Branches.BranchDetail.path} element={<BranchesDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Users.path} element={<Users />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Users.UserDetails.path} element={<UserDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Users.NewUser.path} element={<NewUser />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Settings.path} element={<GeneralSettings />} />

            {/* Settings Routes */}

            <Route path={SETTING_NAVIGATION_ROUTES.General.path} element={<GeneralSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Cuenta.path} element={<AccountSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Password.path} element={<PasswordSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Business_btn.path} element={<BusinessSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Promotions.path} element={<CouponsSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Bank.path} element={<BankSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Plan.path} element={<PlanSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Administrative.path} element={<AdministrativeSettings />} />
          </>
        )
      case APP_ROLES.branchAdmin:
        return (
          <>
            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Home.path} element={<WelcomeScreen />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Pedidos.path} element={<Orders />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Pedidos.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Menu.path} element={<Menu />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Dishes.path} element={<Dishes />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Dishes.DishDetails.path} element={<DishDetails />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Account.path} element={<AccountSettings />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Password.path} element={<PasswordSettings />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Menu.MenuDetails.path} element={<MenuDetails />} />
          </>
        )
      case APP_ROLES.kitchenUser:
        return (
          <>
            <Route path={NAVIGATION_ROUTES_KITCHEN.Home.path} element={<WelcomeScreen />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Orders.path} element={<Orders />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Orders.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.OrderHistory.path} element={<OrderHistory />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.OrderHistory.OrderHistoryDetails.path} element={<OrderHistoryDetails />} />
          </>
        )

      default:
        return <Route path="*" element={<NotFound />} />
    }
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthLayout />}>
          <Route
            element={
              <PrivateRoute
                allowedRoles={[APP_ROLES.superAdmin, APP_ROLES.restaurantAdmin, APP_ROLES.branchAdmin, APP_ROLES.kitchenUser]}
                userRole={userRole}
              />
            }>
            {renderRoutesForRole(userRole)}
          </Route>
          <Route path={"/unauthorized"} element={<Navigate to="/orders" />} />
          <Route path={AUTH_NAVIGATION_ROUTES.Logout.path} element={<Logout />} />
        </Route>
        <Route element={<UnauthenticatedLayout />}>
          <Route path={AUTH_NAVIGATION_ROUTES.Login.path} element={<Login />} />
          <Route path={AUTH_NAVIGATION_ROUTES.Register.path} element={<Register />} />
          <Route path={AUTH_NAVIGATION_ROUTES.ForgetPassword.path} element={<ForgetPassword />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App

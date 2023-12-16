import React from "react"
import { AUTH_NAVIGATION_ROUTES, NAVIGATION_ROUTES, SETTING_NAVIGATION_ROUTES } from "./routes"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
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
import Combos from "./screens/Combos"
import NewDish from "./screens/Dishes/NewDishScreen"
import DishDetails from "./screens/Dishes/DishDetails"
import ComplementsDetails from "./screens/Complements/ComplementsDetails"
import NewComplement from "./screens/Complements/NewComplement"
import Complements from "./screens/Complements/Complements"
import NewMenu from "./screens/Menu/NewMenu"
import NewBranch from "./screens/Branches/NewBranch"
import BranchesDetails from "./screens/Branches/BranchesDetails"
import NewUser from "./screens/Users/NewUser"
import UserSettings from "./screens/Users/UserSettings"
import GeneralSettings from "./screens/Users/GeneralSettings"
import AccountSettings from "./screens/Users/AccountSettings"
import PasswordSettings from "./screens/Users/PasswordSettings"
import BusinessSettings from "./screens/Users/BusinessSettings"
import CouponsSettings from "./screens/Users/CouponsSettings"
import PersonalSettings from "./screens/Users/PersonalSettings"
import BankSettings from "./screens/Users/BankSettings"
import BranchesSettings from "./screens/Users/BranchesSettings"
import KitchenSettings from "./screens/Users/KitchenSettings"
import PlanSettings from "./screens/Users/PlanSettings"
import AdministrativeSettings from "./screens/Users/AdministrativeSettings"
import MenuDetalles from "./screens/Menu/MenuDetalles"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<AuthLayout />}>
          <Route path={NAVIGATION_ROUTES.Dashboard.path} element={<Home />} />

          <Route path={NAVIGATION_ROUTES.Pedidos.path} element={<Orders />} />

          <Route path={NAVIGATION_ROUTES.Transactions.path} element={<Transactions />} />

          <Route path={NAVIGATION_ROUTES.Menu.path} element={<Menu />} />
          <Route path={NAVIGATION_ROUTES.Menu.NewMenu.path} element={<NewMenu />} />

          <Route path={NAVIGATION_ROUTES.Menu.submenu.Dishes.path} element={<Dishes />} />
          <Route path={NAVIGATION_ROUTES.Menu.submenu.Dishes.DishDetails.path} element={<DishDetails />} />
          <Route path={NAVIGATION_ROUTES.Menu.submenu.Dishes.submenu.NewDish.path} element={<NewDish />} />

          <Route path={NAVIGATION_ROUTES.Menu.submenu.Complements.path} element={<Complements />} />
          <Route path={NAVIGATION_ROUTES.Menu.submenu.Complements.ComplementDetails.path} element={<ComplementsDetails />} />
          <Route path={NAVIGATION_ROUTES.Menu.submenu.Complements.submenu.NewComplement.path} element={<NewComplement />} />
          <Route path={NAVIGATION_ROUTES.Menu.MenuDetails.path} element={<MenuDetalles />} />

          <Route path={NAVIGATION_ROUTES.Menu.submenu.Combos.path} element={<Combos />} />

          <Route path={NAVIGATION_ROUTES.Branches.path} element={<Branches />} />
          <Route path={NAVIGATION_ROUTES.Branches.NewBranch.path} element={<NewBranch />} />
          <Route path={NAVIGATION_ROUTES.Branches.BranchDetail.path} element={<BranchesDetails />} />

          <Route path={NAVIGATION_ROUTES.Users.path} element={<Users />} />

          <Route path={NAVIGATION_ROUTES.Users.submenu.Admins.path} element={<Users />} />
          <Route path={NAVIGATION_ROUTES.Users.NewUser.path} element={<NewUser />} />
          <Route path={NAVIGATION_ROUTES.Users.submenu.Settings.path} element={<UserSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.General.path} element={<GeneralSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Cuenta.path} element={<AccountSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Password.path} element={<PasswordSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Business_btn.path} element={<BusinessSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Coupons.path} element={<CouponsSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Personal.path} element={<PersonalSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Branches.path} element={<BranchesSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Kitchen.path} element={<KitchenSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Bank.path} element={<BankSettings />} />
          <Route path={SETTING_NAVIGATION_ROUTES.Plan.path} element={<PlanSettings />} />
          {/*   <Route path={SETTING_NAVIGATION_ROUTES.Administrative.path} element={<AdministrativeSettings />} /> */}
          {/* <Route path={SETTING_NAVIGATION_ROUTES.Notification.path} element={<CouponsSettings />} /> */}

          <Route path={AUTH_NAVIGATION_ROUTES.Logout.path} element={<Logout />} />
        </Route>
        <Route element={<UnauthenticatedLayout />}>
          <Route path={AUTH_NAVIGATION_ROUTES.Login.path} element={<Login />} />
          <Route path={AUTH_NAVIGATION_ROUTES.Register.path} element={<Register />} />
          <Route path={AUTH_NAVIGATION_ROUTES.ForgetPassword.path} element={<ForgetPassword />} />
        </Route>
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App

import {
  AUTH_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_RES_ADMIN,
  NAVIGATION_ROUTES_BRANCH_ADMIN,
  NAVIGATION_ROUTES_SUPER_ADMIN,
  SETTING_NAVIGATION_ROUTES,
  NAVIGATION_ROUTES_KITCHEN,
  NAVIGATION_ROUTES_CASHIER
} from "./routes"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import AuthLayout from "./layout/AuthLayout"
import Login from "./screens/auth/Login"
import UnauthenticatedLayout from "./layout/UnauthenticatedLayout"
import Register from "./screens/auth/Register"
import ForgetPassword from "./screens/auth/PasswordRecovery/ForgetPassword"
import Home from "./screens/Home"
import Orders from "./screens/Orders/OrdersScreen"
import Menu from "./screens/Menu/Menu"
import Branches from "./screens/Branches/Branches"
import Users from "./screens/Users/Users"
import Logout from "./screens/Logout"
import Dishes from "./screens/Dishes/DishesScreen"
import NewDish from "./screens/Dishes/NewDishScreen"
import DishDetails from "./screens/Dishes/DishDetails"
import NewMenu from "./screens/Menu/NewMenu"
import NewBranch from "./screens/Branches/NewBranch"
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
import { OrderDetails } from "./screens/Orders/OrderDetails"
import RestaurantsScreen from "./screens/Restaurants/RestaurantsScreen"
import PrivateRoute from "./layout/PrivateRoute"
import { useSelector } from "react-redux"
import { APP_ROLES } from "./utils/constants"
import { NewAdminUser } from "./screens/Users/NewAdminUser"
import { AdminUserScreen } from "./screens/Users/AdminUserScreen"
import { NewRestaurant } from "./screens/Restaurants/NewRestaurant"
import { Plans } from "./screens/Plans/Plans"
import { NotFound } from "./screens/NotFound"
import { WelcomeScreen } from "./screens/Welcome/WelcomeScreen"
import { NewPlan } from "./screens/Plans/NewPlan"
import { OrderHistory } from "./screens/Orders/OrderHistory"
import { NotificationProvider } from "./components/NotificationProvider"
import EditMenuScreen from "./screens/Menu/EditMenuScreen"
import EditDishScreen from "./screens/Dishes/EditDishScreen"
import { EditRestaurant } from "./screens/Restaurants/EditRestaurant"
import { EditBranch } from "./screens/Branches/EditBranch"
import { EditAdminUser } from "./screens/Users/EditAdminUser"
import { EditPlan } from "./screens/Plans/EditPlan"
import { KitchenTypesAndTags } from "./screens/Tags&KitchenTypes/kitchenTypesAndTags"
import { EditUserScreen } from "./screens/Users/EditUserScreen"
import { Reservations } from "./screens/Reservations/Reservations"
import { ReservationDetails } from "./screens/Reservations/ReservationDetails"
import { CollectionsList } from "./screens/Collections/CollectionsList"
import NewCollection from "./screens/Collections/NewCollection"
import EditCollection from "./screens/Collections/EditCollection"
import { LoyaltyProgram } from "./screens/Loyalty/LoyaltyProgram"
import { LoyaltyProgramsList } from "./screens/Loyalty/LoyaltyProgramsList"
import RewardsTracking from "./screens/Loyalty/RewardsTracking"
import OrdersForKitchen from "./screens/Orders/OrdersForKitchen"

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

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Restaurants.RestaurantDetails.path} element={<EditRestaurant />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Users.path} element={<AdminUserScreen />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Users.NewUser.path} element={<NewAdminUser />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Users.UserDetails.path} element={<EditAdminUser />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Plans.path} element={<Plans />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Plans.NewPlan.path} element={<NewPlan />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Plans.PlanDetails.path} element={<EditPlan />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Account.path} element={<AccountSettings />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.KitchenTypesAndTags.path} element={<KitchenTypesAndTags />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Collections.path} element={<CollectionsList />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Collections.NewCollection.path} element={<NewCollection />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Collections.EditCollection.path} element={<EditCollection />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Loyalty.path} element={<LoyaltyProgramsList />} />

            <Route path={NAVIGATION_ROUTES_SUPER_ADMIN.Loyalty.EditLoyalty.path} element={<LoyaltyProgram />} />
          </>
        )
      case APP_ROLES.restaurantAdmin:
        return (
          <>
            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Dashboard.path} element={<Home />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Pedidos.path} element={<Orders />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Pedidos.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.path} element={<Menu />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.MenuDetails.path} element={<EditMenuScreen />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.NewMenu.path} element={<NewMenu />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.path} element={<Dishes />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.DishDetails.path} element={<EditDishScreen />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Menu.submenu.Dishes.NewDish.path} element={<NewDish />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Branches.path} element={<Branches />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Reservations.path} element={<Reservations />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Reservations.ReservationDetails.path} element={<ReservationDetails />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Branches.NewBranch.path} element={<NewBranch />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Branches.BranchDetail.path} element={<EditBranch />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Users.path} element={<Users />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Users.UserDetails.path} element={<EditUserScreen />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Users.NewUser.path} element={<NewUser />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Settings.path} element={<GeneralSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.General.path} element={<BusinessSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Cuenta.path} element={<AccountSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Password.path} element={<PasswordSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Business_btn.path} element={<BusinessSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Promotions.path} element={<CouponsSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Bank.path} element={<BankSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Plan.path} element={<PlanSettings />} />

            <Route path={SETTING_NAVIGATION_ROUTES.Administrative.path} element={<AdministrativeSettings />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Loyalty.path} element={<LoyaltyProgram />} />

            <Route path={NAVIGATION_ROUTES_RES_ADMIN.Loyalty.RewardsTracking.path} element={<RewardsTracking />} />
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

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Dishes.DishDetails.path} element={<EditDishScreen />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Reservations.path} element={<Reservations />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Reservations.ReservationDetails.path} element={<ReservationDetails />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Account.path} element={<AccountSettings />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Password.path} element={<PasswordSettings />} />

            <Route path={NAVIGATION_ROUTES_BRANCH_ADMIN.Menu.MenuDetails.path} element={<EditMenuScreen />} />
          </>
        )
      case APP_ROLES.cashierUser:
        return (
          <>
            <Route path={NAVIGATION_ROUTES_CASHIER.Home.path} element={<WelcomeScreen />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Pedidos.path} element={<Orders />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Pedidos.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Menu.path} element={<Menu />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Dishes.path} element={<Dishes />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Dishes.DishDetails.path} element={<EditDishScreen />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Account.path} element={<AccountSettings />} />

            <Route path={NAVIGATION_ROUTES_CASHIER.Menu.MenuDetails.path} element={<EditMenuScreen />} />
          </>
        )
      case APP_ROLES.kitchenUser:
        return (
          <>
            <Route path={NAVIGATION_ROUTES_KITCHEN.Home.path} element={<WelcomeScreen />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Orders.path} element={<OrdersForKitchen />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Orders.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.OrderHistory.path} element={<OrderHistory />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Orders.OrderDetails.path} element={<OrderDetails />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Account.path} element={<AccountSettings />} />

            <Route path={NAVIGATION_ROUTES_KITCHEN.Password.path} element={<PasswordSettings />} />
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
                allowedRoles={[
                  APP_ROLES.superAdmin,
                  APP_ROLES.restaurantAdmin,
                  APP_ROLES.branchAdmin,
                  APP_ROLES.cashierUser,
                  APP_ROLES.kitchenUser
                ]}
                userRole={userRole}
              />
            }>
            {renderRoutesForRole(userRole)}
          </Route>
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
  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  )
}

export default App

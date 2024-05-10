import axiosClient from "./axiosClient"

const driverApi = {
  // Get Drivers (Admin Restaurant)
  getAllDrivers: () => axiosClient.get("api/v1/users/get-drivers/all"),

  // Change driver status (Admin Restaurant)
  changeDriverStatus: (id) => axiosClient.patch(`api/v1/users/change-driver-status/${id}`)
}

export default driverApi

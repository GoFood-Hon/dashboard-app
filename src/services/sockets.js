import { io } from "socket.io-client"
import { API_URL } from "./env"

export const orderSocket = io(`${API_URL}admin-restaurant?restaurantId=f07f5aee-8a33-46fd-9ac4-67abd1c25fa4`)

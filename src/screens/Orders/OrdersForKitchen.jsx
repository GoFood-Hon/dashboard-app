import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchAllOrders } from "../../store/features/ordersSlice"
import CardsViewLayout from "../CardsViewLayout"

const data = [
  {
    id: "4166b07c-3941-48c2-8dad-aeec3a0df52a",
    orderId: "8ce05644-c956-4682-b74a-cea26443d12b",
    restaurantId: "3875ad06-6845-474d-a94a-0c0f471b77b6",
    sucursalId: "6a0ad1b7-fd66-4f32-9021-9b41253692ae",
    status: "confirmed",
    serviceType: "onSite",
    isWantedAsSoonAsItIsReady: true,
    scheduledDate: null,
    sentToKitchenTimestamp: "2025-01-14T07:57:45.559Z",
    finishedCookingTimestamp: null,
    deliveryAddress: null,
    shippingPrice: "0.00",
    discount: "0.00",
    subtotal: "310.00",
    isv: "46.50",
    total: "356.50",
    tableNumber: 556,
    note: null,
    paymentMethod: "cash",
    cardId: null,
    paidDate: "2024-12-18T07:48:45.347Z",
    transactionId: null,
    userLoyaltyCardRecordId: null,
    createdAt: "2024-12-18T07:47:05.882Z",
    updatedAt: "2024-12-19T07:57:45.559Z",
    Sucursal: {
      delivery: true,
      pickup: true,
      onSite: true,
      geolocation: {
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326"
          }
        },
        type: "Point",
        coordinates: [-87.17920278100888, 14.067521256142433]
      }
    },
    OrderDetails: [
      {
        id: "d0248a23-9de3-4ab8-aaec-477322bb0fac",
        suborderId: "4166b07c-3941-48c2-8dad-aeec3a0df52a",
        productId: "359db531-bc3c-49ff-aeb1-7e7a2a2459e5",
        quantity: 1,
        price: null,
        subtotal: null,
        discount: null,
        restaurantId: "3875ad06-6845-474d-a94a-0c0f471b77b6",
        orderDetailNote: null,
        createdAt: "2024-12-18T07:47:05.889Z",
        updatedAt: "2024-12-18T07:47:05.889Z",
        additionalsDetails: [
          {
            id: "8844f118-f976-4fbf-ad8e-b99e7136841e",
            additionalId: "080bd590-a78d-4542-8cfa-b659e03fc4fd",
            name: "Tostones",
            isFree: false,
            price: "10.00",
            createdAt: "2024-07-22T15:49:47.336Z",
            updatedAt: "2024-07-22T15:49:47.336Z",
            ExtraDetailOrderDetail: {
              orderDet: "d0248a23-9de3-4ab8-aaec-477322bb0fac",
              extraDet: "8844f118-f976-4fbf-ad8e-b99e7136841e",
              createdA: "2024-12-18T07:47:05.900Z",
              updatedA: "2024-12-18T07:47:05.900Z"
            }
          }
        ],
        Dish: {
          id: "359db531-bc3c-49ff-aeb1-7e7a2a2459e5",
          name: "Pescado Frito",
          price: "300.00",
          images: [
            {
              location: "https://gofood-storage.sfo3.digitaloceanspaces.com/dishes/d0fdcd9e-2ffd-4c69-946e-e576a5659e2e-0.png",
              key: "dishes/d0fdcd9e-2ffd-4c69-946e-e576a5659e2e-0.png"
            }
          ],
          restaurantId: "3875ad06-6845-474d-a94a-0c0f471b77b6"
        }
      }
    ],
    Restaurant: {
      id: "3875ad06-6845-474d-a94a-0c0f471b77b6",
      shippingPrice: "85.00",
      shippingFree: false
    },
    Order: {
      userId: "7657e1e5-a3e3-4880-bd9b-2446662609aa",
      Coupons: [],
      User: {
        id: "7657e1e5-a3e3-4880-bd9b-2446662609aa",
        name: "Jorge Siguenza",
        email: "jorge24abrahan@gmail.com",
        address: null,
        photo: null,
        phoneNumber: "+50499999994"
      }
    }
  },
  {
    id: "2df66569-3aab-4f59-8c2d-d3d5cf827d41",
    orderId: "8c435c4c-5b97-471b-a27b-d85f64922fc4",
    restaurantId: "3875ad06-6845-474d-a94a-0c0f471b77b6",
    sucursalId: "6a0ad1b7-fd66-4f32-9021-9b41253692ae",
    status: "confirmed",
    serviceType: "delivery",
    isWantedAsSoonAsItIsReady: true,
    scheduledDate: null,
    sentToKitchenTimestamp: "2025-01-14T08:26:49.061Z",
    finishedCookingTimestamp: null,
    deliveryAddress: null,
    shippingPrice: "0.00",
    discount: "0.00",
    subtotal: "121.50",
    isv: "18.22",
    total: "139.72",
    tableNumber: null,
    note: "Por favor no le pongan cebolla a mis tacos ya que soy alérgico",
    paymentMethod: "cash",
    cardId: null,
    paidDate: "2024-12-28T02:18:19.838Z",
    transactionId: null,
    userLoyaltyCardRecordId: null,
    createdAt: "2024-12-28T02:18:08.037Z",
    updatedAt: "2024-12-28T02:26:49.061Z",
    Sucursal: {
      delivery: true,
      pickup: true,
      onSite: true,
      geolocation: {
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326"
          }
        },
        type: "Point",
        coordinates: [-87.17920278100888, 14.067521256142433]
      }
    },
    OrderDetails: [
      {
        id: "c0a9e88b-9496-4c1e-a330-ff9a81f0f822",
        suborderId: "2df66569-3aab-4f59-8c2d-d3d5cf827d41",
        productId: "ec800068-ddad-413d-9ee2-c3a243816bcd",
        quantity: 2,
        price: "120.00",
        subtotal: "121.50",
        discount: "0.00",
        restaurantId: "3875ad06-6845-474d-a94a-0c0f471b77b6",
        orderDetailNote: "Quiero que una de las órdenes de tacos tenga bastante chile y la otro no",
        createdAt: "2024-12-28T02:18:08.048Z",
        updatedAt: "2024-12-28T02:18:08.048Z",
        additionalsDetails: [
          {
            id: "7d9a6fc8-0b4a-4a2e-9bdf-b6ff73120eb2",
            additionalId: "1f234959-30b7-4bbc-8124-eabaabacff1a",
            name: "Salsa Roja",
            isFree: false,
            price: "0.50",
            createdAt: "2024-08-21T07:01:08.073Z",
            updatedAt: "2024-08-21T07:01:08.073Z",
            ExtraDetailOrderDetail: {
              orderDet: "c0a9e88b-9496-4c1e-a330-ff9a81f0f822",
              extraDet: "7d9a6fc8-0b4a-4a2e-9bdf-b6ff73120eb2",
              createdA: "2024-12-28T02:18:08.056Z",
              updatedA: "2024-12-28T02:18:08.056Z"
            }
          },
          {
            id: "e85ec22d-3b63-4700-ac18-2e8ec414fa20",
            additionalId: "5f2cdd4f-57aa-4e2f-925d-529dcac5e501",
            name: "Guacamole",
            isFree: false,
            price: "1.00",
            createdAt: "2024-08-21T07:01:08.154Z",
            updatedAt: "2024-08-21T07:01:08.154Z",
            ExtraDetailOrderDetail: {
              orderDet: "c0a9e88b-9496-4c1e-a330-ff9a81f0f822",
              extraDet: "e85ec22d-3b63-4700-ac18-2e8ec414fa20",
              createdA: "2024-12-28T02:18:08.056Z",
              updatedA: "2024-12-28T02:18:08.056Z"
            }
          }
        ],
        Dish: {
          id: "ec800068-ddad-413d-9ee2-c3a243816bcd",
          name: "Taco especial",
          price: "120.00",
          images: [
            {
              location: "https://gofood-storage.sfo3.digitaloceanspaces.com/dishes/19ed4d1f-6e49-45d0-8b8c-9298d9a8d3b0-0.png",
              key: "dishes/19ed4d1f-6e49-45d0-8b8c-9298d9a8d3b0-0.png"
            }
          ],
          restaurantId: "3875ad06-6845-474d-a94a-0c0f471b77b6"
        }
      }
    ],
    Restaurant: {
      id: "3875ad06-6845-474d-a94a-0c0f471b77b6",
      shippingPrice: "85.00",
      shippingFree: false
    },
    Order: {
      userId: "7657e1e5-a3e3-4880-bd9b-2446662609aa",
      Coupons: [],
      User: {
        id: "7657e1e5-a3e3-4880-bd9b-2446662609aa",
        name: "Jorge Siguenza",
        email: "jorge24abrahan@gmail.com",
        address: null,
        photo: null,
        phoneNumber: "+50499999994"
      }
    },
    isMinimum: true
  }
]

const OrdersForKitchen = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const limit = useSelector((state) => state.orders.itemsPerPage)
  const page = useSelector((state) => state.orders.currentPage)
  const ordersPerPage = useSelector((state) => state.orders.ordersPerPage)
  const totalOrders = useSelector((state) => state.orders.totalOrders)
  const totalPageCount = useSelector((state) => state.orders.totalPagesCount)
  const ordersList = ordersPerPage[page] || []
  const loadingOrders = useSelector((state) => state.orders.loadingOrders)

  useEffect(() => {
    if (!ordersPerPage[page]) {
      dispatch(fetchAllOrders({ limit, page, order: "ASC", status: "confirmed" }))
    }
  }, [dispatch, limit, page, ordersPerPage, user.role])

  return (
    <CardsViewLayout
      title="Pedidos recientes"
      page={page}
      limit={limit}
      totalPageCount={totalPageCount}
      totalElements={totalOrders}
      elementsName="pedidos"
      loadingElements={loadingOrders}
      elementsList={ordersList}
      onPaginationChange={(newPage) => dispatch(setCurrentPage(newPage))}
      user={user}
      kitchenView
    />
  )
}

export default OrdersForKitchen

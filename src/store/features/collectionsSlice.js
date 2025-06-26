import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import collectionsApi from "../../api/collectionsApi"
import { ITEMS_PER_PAGE, ITEMS_PER_PAGE_CARDS } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"
import dishesApi from "../../api/dishesApi"
import restaurantsApi from "../../api/restaurantApi"

const initialState = {
  collectionDetails: null,
  dishesList: [],
  currentPage: 1,
  collectionsPerPage: [],
  totalCollections: 0,
  totalPagesCount: 0,
  loadingCollections: false,
  creatingCollection: false,
  updatingCollection: false,
  fetchingDishes: false,
  itemsPerPage: ITEMS_PER_PAGE,
  status: "idle",
  error: null,
  collectionType: "dishes",

  //Dishes store params
  dishes: [],
  currentDishPage: 1,
  dishesPerPage: ITEMS_PER_PAGE_CARDS,
  hasMoreDishes: true,
  dishesLoading: false,
  updatingDishes: false,

  //Restaurants store params
  restaurants: [],
  currentRestaurantPage: 1,
  restaurantsPerPage: ITEMS_PER_PAGE_CARDS,
  hasMoreRestaurants: true,
  restaurantsLoading: false,
  updatingRestaurants: false,

  //Elements count
  elementsCount: 0,

  //Search collections
  searchData: null,
  searchDishesData: null,
  searchRestaurantsData: null,
  searchField: "name"
}

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.getAllCollections({
        limit,
        page,
        order: "DESC",
        search_field,
        search
      })

      return { data: response.data, results: response.results, page }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.message)
    }
  }
)

export const fetchDishesForCollections = createAsyncThunk(
  "collections/fetchDishesForCollections",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await dishesApi.getAllDishes({
        limit,
        page,
        order: "DESC",
        search_field,
        search
      })

      return {
        data: response.data.map((item) => ({
          id: item.id,
          name: item.name,
          images: item.images
        })),
        results: response.results,
        page
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.message)
    }
  }
)

export const fetchRestaurantsForCollections = createAsyncThunk(
  "collections/fetchRestaurantsForCollections",
  async ({ limit, page, search_field, search }, { rejectWithValue }) => {
    try {
      const response = await restaurantsApi.getAllRestaurants({
        limit,
        page,
        order: "DESC",
        search_field,
        search
      })

      return {
        data: response.data.map((item) => ({
          id: item.id,
          name: item.name,
          images: item.images
        })),
        results: response.results,
        page
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: error,
        color: "red",
        duration: 7000
      })
      return rejectWithValue(error.message)
    }
  }
)

export const fetchCollectionDetails = createAsyncThunk(
  "collections/fetchCollectionDetails",
  async (setId, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.getCollectionDetails(setId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createCollection = createAsyncThunk(
  "collections/createCollection",
  async ({ params, formDataImage }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.createCollection({
        name: params.name,
        description: params.description,
        type: params.type
      })

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response.message)
      }

      let banner = []
      if (formDataImage) {
        const imageResponse = await collectionsApi.createCollectionImage(response.data.id, formDataImage)
        banner = imageResponse.data.banner
        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: response.message,
            color: "red"
          })

          return rejectWithValue(imageResponse.message)
        }
      }

      if (params.type === "dishes") {
        await Promise.all(params.dishes.map((dishId) => collectionsApi.addDishToCollection(response.data.id, dishId)))
      } else {
        await Promise.all(
          params.restaurants.map((restaurantId) => collectionsApi.addRestaurantToCollection(response.data.id, restaurantId))
        )
      }

      showNotification({
        title: "Creación exitosa",
        message: `La coleccíon fue creada exitosamente`,
        color: "green"
      })

      return { ...response.data, banner }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateCollectionStatus = createAsyncThunk(
  "collections/updateCollectionStatus",
  async ({ setId, params }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.updateCollection(setId, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateCollection = createAsyncThunk(
  "collections/updateCollection",
  async ({ id, params, formDataImage }, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      const response = await collectionsApi.updateCollection(id, {
        name: params?.name,
        description: params?.description,
        type: params?.type
      })
      let collectionData = response?.data

      if (response?.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })

        return rejectWithValue(response?.message)
      }

      let banner = []
      if (formDataImage) {
        const imageResponse = await collectionsApi.createCollectionImage(id, formDataImage)
        banner = imageResponse?.data?.banner
        if (imageResponse.error) {
          showNotification({
            title: "Error",
            message: response.message,
            color: "red"
          })

          return rejectWithValue(imageResponse?.message)
        }

        collectionData = { ...collectionData, banner }
      }

      if (params?.newElements) {
        if (params?.type === "dishes") {
          await Promise.all(params?.newElements?.map((elementId) => collectionsApi.addDishToCollection(id, elementId)))
        } else {
          await Promise.all(params?.newElements?.map((elementId) => collectionsApi.addRestaurantToCollection(id, elementId)))
        }
      }

      if (params?.deletedElements) {
        if (params?.type === "dishes") {
          await Promise.all(params?.deletedElements?.map((elementId) => collectionsApi.deleteDishFromCollection(id, elementId)))
        } else {
          await Promise.all(
            params?.deletedElements?.map((elementId) => collectionsApi.deleteRestaurantFromCollection(id, elementId))
          )
        }
      }

      if (params?.type === "restaurants") {
        collectionData = { ...collectionData, restaurants: state.collections.elementsCount }
      } else {
        collectionData = { ...collectionData, dishes: state.collections.elementsCount }
      }

      showNotification({
        title: "Actualización exitosa",
        message: `La coleccíon se actualizó correctamente`,
        color: "green"
      })

      return collectionData
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const createCollectionImage = createAsyncThunk(
  "collections/createCollectionImage",
  async ({ setId, params }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.createCollectionImage(setId, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addDishToCollection = createAsyncThunk(
  "collections/addDishToCollection",
  async ({ setId, dishId }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.addDishToCollection(setId, dishId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteDishFromCollection = createAsyncThunk(
  "collections/deleteDishFromCollection",
  async ({ setId, dishId }, { rejectWithValue }) => {
    try {
      await collectionsApi.deleteDishFromCollection(setId, dishId)
      return { setId, dishId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const addRestaurantToCollection = createAsyncThunk(
  "collections/addRestaurantToCollection",
  async ({ setId, restaurantId }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.addRestaurantToCollection(setId, restaurantId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteRestaurantFromCollection = createAsyncThunk(
  "collections/deleteRestaurantFromCollection",
  async ({ setId, restaurantId }, { rejectWithValue }) => {
    try {
      await collectionsApi.deleteRestaurantFromCollection(setId, restaurantId)
      return { setId, restaurantId }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Slice
const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTotalCollections: (state, action) => {
      state.totalCollections = action.payload
    },
    setCurrentDishPage: (state, action) => {
      state.currentDishPage = action.payload
    },
    setCurrentRestaurantPage: (state, action) => {
      state.currentRestaurantPage = action.payload
    },
    setCollectionType: (state, action) => {
      state.collectionType = action.payload
    },
    setElementsCount: (state, action) => {
      state.elementsCount = action.payload
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setSearchDishesData: (state, action) => {
      state.searchDishesData = action.payload
    },
    setSearchRestaurantsData: (state, action) => {
      state.searchRestaurantsData = action.payload
    },
    setSelectedSearchOption: (state, action) => {
      state.searchField = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Collections
      .addCase(fetchCollections.pending, (state) => {
        state.loadingCollections = true
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        state.collectionsPerPage[page] = data

        state.loadingCollections = false
        state.currentPage = page
        state.totalCollections = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loadingCollections = false
        state.error = action.payload
      })

      //Fetch dishes for collection
      .addCase(fetchDishesForCollections.pending, (state, action) => {
        const { page } = action.meta.arg

        if (page === 1) {
          state.dishesLoading = true
        } else {
          state.updatingDishes = true
        }
      })
      .addCase(fetchDishesForCollections.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        if (page === 1) {
          state.dishes = data
        } else {
          if (state.hasMoreDishes) {
            state.dishes = [...state.dishes, ...data]
          }
        }

        state.currentDishPage = page
        state.hasMoreDishes = state.dishes.length < results
        state.dishesLoading = false
        state.updatingDishes = false
      })
      .addCase(fetchDishesForCollections.rejected, (state, action) => {
        state.dishesLoading = false
        state.updatingDishes = false
        state.error = action.error.message
      })

      //Fetch restaurants for collections
      .addCase(fetchRestaurantsForCollections.pending, (state, action) => {
        const { page } = action.meta.arg

        if (page === 1) {
          state.restaurantsLoading = true
        } else {
          state.updatingRestaurants = true
        }
      })
      .addCase(fetchRestaurantsForCollections.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        if (page === 1) {
          state.restaurants = data
        } else {
          if (state.hasMoreRestaurants) {
            state.restaurants = [...state.restaurants, ...data]
          }
        }

        state.currentRestaurantPage = page
        state.hasMoreRestaurants = state.restaurants.length < results
        state.restaurantsLoading = false
        state.updatingRestaurants = false
      })
      .addCase(fetchRestaurantsForCollections.rejected, (state, action) => {
        state.restaurantsLoading = false
        state.updatingRestaurants = false
        state.error = action.error.message
      })

      // Fetch Collection Details
      .addCase(fetchCollectionDetails.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCollectionDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.collectionDetails = action.payload
      })
      .addCase(fetchCollectionDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Create Collection
      .addCase(createCollection.pending, (state) => {
        state.creatingCollection = true
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        const newCollection = action.payload

        if (!state.collectionsPerPage[1]) {
          state.collectionsPerPage[1] = []
        }
        state.collectionsPerPage[1].unshift(newCollection)

        for (let i = 1; i <= state.totalPagesCount; i++) {
          if (state.collectionsPerPage[i]?.length > state.itemsPerPage) {
            const lastItem = state.collectionsPerPage[i].pop()
            if (state.collectionsPerPage[i + 1]) {
              state.collectionsPerPage[i + 1].unshift(lastItem)
            }
          } else {
            break
          }
        }

        const consecutivePages = [1]
        for (let i = 2; i <= state.totalPagesCount; i++) {
          if (state.adminUsersByPage[i]) {
            if (consecutivePages.includes(i - 1)) {
              consecutivePages.push(i)
            } else {
              delete state.adminUsersByPage[i]
            }
          }
        }

        state.totalCollections += 1
        state.totalPagesCount = Math.ceil(state.totalCollections / state.itemsPerPage)
        state.creatingCollection = false
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.creatingCollection = false
        state.error = action.payload
      })

      // Update Collection
      .addCase(updateCollection.pending, (state) => {
        state.updatingCollection = true
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        const { id } = action.payload
        const currentPageCollections = state.collectionsPerPage[state.currentPage]
        const index = currentPageCollections.findIndex((collection) => collection?.id == id)

        if (index !== -1) {
          currentPageCollections[index] = action.payload
        }
        state.updatingCollection = false
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.updatingCollection = false
        state.error = action.payload
      })

      // Update Collection Status
      .addCase(updateCollectionStatus.fulfilled, (state, action) => {
        const { id, isActive } = action.payload
        const currentPageCollections = state.collectionsPerPage[state.currentPage]
        const index = currentPageCollections.findIndex((collection) => collection?.id === id)

        if (index !== -1) {
          currentPageCollections[index] = { ...currentPageCollections[index], isActive }
        }
      })

      // Create Collection Image
      .addCase(createCollectionImage.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createCollectionImage.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.collectionDetails.banner = action.payload.banner
      })
      .addCase(createCollectionImage.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Add Dish to Collection
      .addCase(addDishToCollection.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addDishToCollection.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.collectionDetails.dishes.push(action.payload)
      })
      .addCase(addDishToCollection.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Delete Dish from Collection
      .addCase(deleteDishFromCollection.fulfilled, (state, action) => {
        const { dishId } = action.payload
        state.collectionDetails.dishes = state.collectionDetails.dishes.filter((dish) => dish.id !== dishId)
      })

      // Add Restaurant to Collection
      .addCase(addRestaurantToCollection.pending, (state) => {
        state.status = "loading"
      })
      .addCase(addRestaurantToCollection.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.collectionDetails.restaurants.push(action.payload)
      })
      .addCase(addRestaurantToCollection.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Delete Restaurant from Collection
      .addCase(deleteRestaurantFromCollection.fulfilled, (state, action) => {
        const { restaurantId } = action.payload
        state.collectionDetails.restaurants = state.collectionDetails.restaurants.filter(
          (restaurant) => restaurant.id !== restaurantId
        )
      })
  }
})

export const {
  setCurrentPage,
  setTotalCollections,
  setCurrentDishPage,
  setCurrentRestaurantPage,
  setCollectionType,
  setElementsCount,
  setSearchData,
  setSearchDishesData,
  setSearchRestaurantsData,
  setSelectedSearchOption
} = collectionsSlice.actions

export default collectionsSlice.reducer

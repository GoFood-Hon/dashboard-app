import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import collectionsApi from "../../api/collectionsApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"
import dishesApi from "../../api/dishesApi"

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

export const createCollection = createAsyncThunk("collections/createCollection", async (params, { rejectWithValue }) => {
  try {
    const response = await collectionsApi.createCollection(params)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateCollection = createAsyncThunk(
  "collections/updateCollection",
  async ({ setId, params }, { rejectWithValue }) => {
    try {
      const response = await collectionsApi.updateCollection(setId, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
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
  initialState: {
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
    error: null
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setTotalCollections: (state, action) => {
      state.totalCollections = action.payload
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
      .addCase(fetchDishesForCollections.pending, (state) => {
        state.fetchingDishes = true
      })
      .addCase(fetchDishesForCollections.fulfilled, (state, action) => {
        const { data, results, page } = action.payload

        state.dishesList = data

        state.fetchingDishes = false
        // state.currentPage = page
        // state.totalCollections = results
        // state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchDishesForCollections.rejected, (state, action) => {
        state.fetchingDishes = false
        state.error = action.payload
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
        state.status = "loading"
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.collections.push(action.payload)
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // Update Collection
      .addCase(updateCollection.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.status = "succeeded"
        const index = state.collections.findIndex((collection) => collection.id === action.payload.id)
        if (index !== -1) {
          state.collections[index] = action.payload
        }
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
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

export const { setCurrentPage, setTotalCollections } = collectionsSlice.actions

export default collectionsSlice.reducer

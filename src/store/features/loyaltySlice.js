import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import loyaltyApi from "../../api/loyaltyApi"
import { ITEMS_PER_PAGE } from "../../utils/paginationConfig"
import { showNotification } from "@mantine/notifications"

// Async thunks para interactuar con los endpoints
export const fetchLoyaltyProgramsByRestaurant = createAsyncThunk(
  "loyalty/fetchLoyaltyProgramsByRestaurant",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.getLoyaltyProgramsByRestaurant(restaurantId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchAllLoyaltyPrograms = createAsyncThunk(
  "loyalty/fetchAllLoyaltyPrograms",
  async ({ page, limit, order, orderby, search, search_field, status }, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.getAllLoyaltyPrograms({ page, limit, order, orderby, search, search_field, status })
      return { data: response.data, results: response.results, page }
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getLoyaltyProgramById = createAsyncThunk("loyalty/getLoyaltyProgramById", async (id, { rejectWithValue }) => {
  try {
    const response = await loyaltyApi.getLoyaltyProgram(id)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const createLoyaltyProgram = createAsyncThunk(
  "loyalty/createLoyaltyProgram",
  async (params, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState()
      const { loyaltyCards } = state.loyalty
      const response = await loyaltyApi.createLoyaltyProgram(params)
      let loyaltyProgram = response.data

      if (Array.isArray(loyaltyCards) && loyaltyCards.length) {
        try {
          const newCards = loyaltyCards.map((card, index) => ({ ...card, index })).filter((card) => !card.id)

          if (newCards.length) {
            for (const card of newCards) {
              try {
                const response = await loyaltyApi.createLoyaltyCardWithReward(loyaltyProgram.id, card)
                dispatch(updateLoyaltyCards({ ...response.data, index: card.index }))
              } catch (error) {
                throw error
              }
            }
          }
        } catch (error) {
          if (error) {
            return rejectWithValue(error)
          }
        }
      }

      showNotification({
        title: "Creación exitosa",
        message: "El programa de lealtad fue creado correctamente",
        color: "green"
      })

      return loyaltyProgram
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateLoyaltyProgram = createAsyncThunk(
  "loyalty/updateLoyaltyProgram",
  async ({ id, params }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState()
      const { deletedCards, loyaltyCards } = state.loyalty
      const response = await loyaltyApi.updateLoyaltyProgram(id, params)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })
        return rejectWithValue(response.error)
      }

      if (Array.isArray(deletedCards) && deletedCards.length) {
        try {
          await Promise.all(
            deletedCards.map(async (cardId) => {
              try {
                await loyaltyApi.deleteLoyaltyCardWithReward(id, cardId)
              } catch (error) {
                throw error
              }
            })
          )
          dispatch(clearDeletedCards())
        } catch (error) {
          return rejectWithValue(error)
        }
      }

      if (Array.isArray(loyaltyCards) && loyaltyCards.length) {
        try {
          const newCards = loyaltyCards.map((card, index) => ({ ...card, index })).filter((card) => !card.id)

          if (newCards.length) {
            for (const card of newCards) {
              try {
                const response = await loyaltyApi.createLoyaltyCardWithReward(id, card)
                dispatch(updateLoyaltyCards({ ...response.data, index: card.index }))
              } catch (error) {
                throw error
              }
            }
          }
        } catch (error) {
          if (error) {
            return rejectWithValue(error)
          }
        }
      }

      showNotification({
        title: "Actualización exitosa",
        message: "Se actualizó la información del programa de lealtad",
        color: "green"
      })

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const updateLoyaltyProgramStatus = createAsyncThunk(
  "loyalty/updateLoyaltyProgramStatus",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.updateLoyaltyProgram(id, params)

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })
        return rejectWithValue(response.error)
      }

      showNotification({
        title: "Actualización exitosa",
        message: "Se actualizó el estado del programa de lealtad",
        color: "green"
      })

      return response.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const deleteLoyaltyCardWithReward = createAsyncThunk(
  "loyalty/deleteLoyaltyCardWithReward",
  async ({ loyaltyProgramId, redeemableCardId }, { rejectWithValue }) => {
    try {
      await loyaltyApi.deleteLoyaltyCardWithReward(loyaltyProgramId, redeemableCardId)
      return id
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const getUserLoyaltyCards = createAsyncThunk(
  "loyalty/getUserLoyaltyCards",
  async ({ restaurantId, page, limit, identityNumber, loyaltyCardCode, isRedeemed }, { rejectWithValue }) => {
    try {
      const response = await loyaltyApi.getUserLoyaltyCards({
        restaurantId,
        page,
        limit,
        identityNumber,
        loyaltyCardCode,
        isRedeemed
      })

      if (response.error) {
        showNotification({
          title: "Error",
          message: response.message,
          color: "red"
        })
        return rejectWithValue(response.error)
      }

      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ocurrió un error inesperado."
      showNotification({
        title: "Error",
        message: errorMessage,
        color: "red"
      })

      return rejectWithValue(errorMessage)
    }
  }
)

// Slice
const loyaltySlice = createSlice({
  name: "loyalty",
  initialState: {
    programs: [],
    itemsPerPage: ITEMS_PER_PAGE,
    loyaltyCards: [],
    deletedCards: [],
    programsPerPage: [],
    totalPrograms: 0,
    totalPagesCount: 0,
    currentPage: 1,
    loadingPrograms: false,
    creatingPrograms: false,
    updatingPrograms: false,
    loading: false,
    error: null,

    // Buscador de programas de lealtad
    searchData: null,

    //Loyalty Tracking variables
    clientIdentity: null,
    cardCode: null,
    userRewardData: null,
    loadingUserData: false,
    loadingUserCards: false,
    filterValue: "Todas",
    prefetchUser: null
  },
  reducers: {
    resetError(state) {
      state.error = null
    },
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
    updateLoyaltyCards: (state, action) => {
      const updatedCard = action.payload

      state.loyaltyCards = state.loyaltyCards.map((card, index) =>
        (!card.id && index === updatedCard.index) || card.id === updatedCard.id ? updatedCard : card
      )
    },
    removeLoyaltyCard: (state, action) => {
      const index = action.payload

      if (index >= 0 && index < state.loyaltyCards.length) {
        const cardToRemove = state.loyaltyCards[index]

        if (cardToRemove?.id) {
          state.deletedCards = [...state.deletedCards, cardToRemove.id]
        }

        state.loyaltyCards = state.loyaltyCards.filter((_, i) => i !== index)
      }
    },
    addCards: (state, action) => {
      state.loyaltyCards = [...(state.loyaltyCards || []), action.payload].sort(
        (a, b) => a.purchasesWithWhichRewardBegins - b.purchasesWithWhichRewardBegins
      )
    },
    clearDeletedCards: (state) => {
      state.deletedCards = []
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload
    },
    setClientIdentity: (state, action) => {
      state.clientIdentity = action.payload
    },
    setCardCode: (state, action) => {
      state.cardCode = action.payload
    },
    setFilterValue: (state, action) => {
      state.filterValue = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Loyalty Programs by Restaurant
      .addCase(fetchLoyaltyProgramsByRestaurant.pending, (state) => {
        state.loadingPrograms = true
      })
      .addCase(fetchLoyaltyProgramsByRestaurant.fulfilled, (state, action) => {
        state.loadingPrograms = false
        state.programs = action.payload
        state.loyaltyCards = state.programs.LoyaltyCards.sort((a, b) => {
          return a.purchasesWithWhichRewardBegins - b.purchasesWithWhichRewardBegins
        })
      })
      .addCase(fetchLoyaltyProgramsByRestaurant.rejected, (state, action) => {
        state.loadingPrograms = false
        state.error = action.payload
      })

      // Fetch All Loyalty Programs
      .addCase(fetchAllLoyaltyPrograms.pending, (state) => {
        state.loadingPrograms = true
      })
      .addCase(fetchAllLoyaltyPrograms.fulfilled, (state, action) => {
        const { data, results, page } = action.payload
        state.programsPerPage[page] = data

        state.loadingPrograms = false
        state.currentPage = page
        state.totalPrograms = results
        state.totalPagesCount = Math.ceil(results / action.meta.arg.limit)
      })
      .addCase(fetchAllLoyaltyPrograms.rejected, (state, action) => {
        state.loadingPrograms = false
        state.error = action.payload
      })

      // Create Loyalty Program
      .addCase(createLoyaltyProgram.pending, (state) => {
        state.creatingPrograms = true
        state.error = null
      })
      .addCase(createLoyaltyProgram.fulfilled, (state, action) => {
        state.creatingPrograms = false
        state.programs = action.payload
        state.programs.LoyaltyCards = state.loyaltyCards
      })
      .addCase(createLoyaltyProgram.rejected, (state, action) => {
        state.creatingPrograms = false
        state.error = action.payload
      })

      // Update Loyalty Program
      .addCase(updateLoyaltyProgram.pending, (state) => {
        state.updatingPrograms = true
      })
      .addCase(updateLoyaltyProgram.fulfilled, (state, action) => {
        const {
          amountOfDaysSinceFirstPurchaseToRestartCounting,
          maximumAmountOfPurchasesAllowed,
          minimumPurchasePriceForActivation,
          title,
          description,
          isActive
        } = action.payload
        state.programs = {
          ...state.programs,
          amountOfDaysSinceFirstPurchaseToRestartCounting,
          maximumAmountOfPurchasesAllowed,
          minimumPurchasePriceForActivation,
          title,
          description,
          isActive
        }
        state.updatingPrograms = false
      })
      .addCase(updateLoyaltyProgram.rejected, (state, action) => {
        state.updatingPrograms = false
        state.error = action.payload
      })

      // Update Loyalty Program Status
      .addCase(updateLoyaltyProgramStatus.pending, (state) => {
        state.updatingPrograms = true
      })
      .addCase(updateLoyaltyProgramStatus.fulfilled, (state, action) => {
        const { isActive } = action.payload
        state.programs = {
          ...state.programs,
          isActive
        }
        state.updatingPrograms = false
      })
      .addCase(updateLoyaltyProgramStatus.rejected, (state, action) => {
        state.updatingPrograms = false
        state.error = action.payload
      })

      // Delete Card Reward
      .addCase(deleteLoyaltyCardWithReward.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteLoyaltyCardWithReward.fulfilled, (state, action) => {
        state.loading = false
        //state.programs = state.programs.filter((reward) => reward.id !== action.payload)
      })
      .addCase(deleteLoyaltyCardWithReward.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get Loyalty Program By Id
      .addCase(getLoyaltyProgramById.pending, (state) => {
        state.loading = true
      })
      .addCase(getLoyaltyProgramById.fulfilled, (state, action) => {
        state.loading = false
        state.programs = action.payload
        state.loyaltyCards = state.programs.LoyaltyCards.sort((a, b) => {
          return a.purchasesWithWhichRewardBegins - b.purchasesWithWhichRewardBegins
        })
      })
      .addCase(getLoyaltyProgramById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getUserLoyaltyCards.pending, (state) => {
        if (state.prefetchUser) {
          state.loadingUserCards = true
        } else {
          state.loadingUserData = true
        }
      })
      .addCase(getUserLoyaltyCards.fulfilled, (state, action) => {
        const { user, loyaltyCards } = action.payload

        if (state.prefetchUser === user.identityNumber) {
          state.userRewardData = {
            ...state.userRewardData,
            loyaltyCards: loyaltyCards ?? []
          }
        } else {
          state.userRewardData = action.payload
        }

        state.prefetchUser = user.identityNumber

        state.loadingUserData = false
        state.loadingUserCards = false
      })
      .addCase(getUserLoyaltyCards.rejected, (state, action) => {
        state.loadingUserData = false
        state.loadingUserCards = false
        state.error = action.payload
      })
  }
})

export const {
  resetError,
  setPage,
  updateLoyaltyCards,
  removeLoyaltyCard,
  addCards,
  clearDeletedCards,
  setSearchData,
  setClientIdentity,
  setCardCode,
  setFilterValue
} = loyaltySlice.actions

export default loyaltySlice.reducer

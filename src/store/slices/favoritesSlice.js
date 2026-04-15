import { createSlice } from '@reduxjs/toolkit'

const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('coffeeShopFavorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: loadFavorites()
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload
      const exists = state.items.find(item => item.id === product.id)
      if (exists) {
        state.items = state.items.filter(item => item.id !== product.id)
      } else {
        state.items.push(product)
      }
      localStorage.setItem('coffeeShopFavorites', JSON.stringify(state.items))
    },
    clearFavorites: (state) => {
      state.items = []
      localStorage.removeItem('coffeeShopFavorites')
    }
  }
})

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
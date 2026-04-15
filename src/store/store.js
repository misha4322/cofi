import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './slices/cartSlice'
import productsSlice from './slices/productsSlice'
import favoritesSlice from './slices/favoritesSlice'
import ordersSlice from './slices/ordersSlice'
import adminSlice from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    products: productsSlice,
    favorites: favoritesSlice,
    orders: ordersSlice,
    admin: adminSlice,
  },
})
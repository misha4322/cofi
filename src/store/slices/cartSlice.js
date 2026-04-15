import { createSlice } from '@reduxjs/toolkit'

const getDefaultCartState = () => ({
  items: [],
  totalAmount: 0,
  totalCount: 0,
})

const normalizeCart = (rawCart) => {
  if (!rawCart || typeof rawCart !== 'object') return getDefaultCartState()
  const safeItems = Array.isArray(rawCart.items) ? rawCart.items : []
  const items = safeItems
    .filter(item => item && typeof item.id !== 'undefined')
    .map(item => ({
      ...item,
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Number(item.price) || 0,
    }))

  return {
    items,
    totalCount: items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: items.reduce((total, item) => total + (item.price * item.quantity), 0),
  }
}

const loadCartFromLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return getDefaultCartState()
    const serializedCart = localStorage.getItem('coffeeShopCart')
    if (serializedCart === null) {
      return getDefaultCartState()
    }
    return normalizeCart(JSON.parse(serializedCart))
  } catch (err) {
    console.error('Error loading cart from localStorage:', err)
    return getDefaultCartState()
  }
}

const saveCartToLocalStorage = (cart) => {
  try {
    if (typeof window === 'undefined') return
    const safeCart = normalizeCart(cart)
    const serializedCart = JSON.stringify(safeCart)
    localStorage.setItem('coffeeShopCart', serializedCart)
  } catch (err) {
    console.error('Error saving cart to localStorage:', err)
  }
}

const initialState = loadCartFromLocalStorage()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      saveCartToLocalStorage(state)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      saveCartToLocalStorage(state)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        } else {
          item.quantity = quantity
        }
      }
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      saveCartToLocalStorage(state)
    },
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      state.totalCount = 0
      saveCartToLocalStorage(state)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
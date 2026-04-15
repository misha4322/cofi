import { createSlice } from '@reduxjs/toolkit'

const ORDER_STORAGE_KEY = 'coffeeShopOrders'

const initialState = {
  orders: [],
}

const loadOrders = () => {
  try {
    if (typeof window === 'undefined') return initialState
    const rawOrders = localStorage.getItem(ORDER_STORAGE_KEY)
    if (!rawOrders) return initialState
    const parsedOrders = JSON.parse(rawOrders)
    if (!Array.isArray(parsedOrders)) return initialState

    const normalizedOrders = parsedOrders.map((order) => {
      const normalizedStatus = order?.status || 'pending'
      return {
        ...order,
        status: normalizedStatus,
        statusText: order?.statusText || defaultStatusText[normalizedStatus] || normalizedStatus,
        isClosedByAdmin: Boolean(order?.isClosedByAdmin),
        adminActions: Array.isArray(order?.adminActions) ? order.adminActions : [],
      }
    })

    return {
      orders: normalizedOrders,
    }
  } catch (error) {
    console.error('Error loading orders from localStorage:', error)
    return initialState
  }
}

const persistOrders = (orders) => {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    console.error('Error saving orders to localStorage:', error)
  }
}

const nowIso = () => new Date().toISOString()

const createAdminAction = (status, note = '') => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  status,
  note,
  createdAt: nowIso(),
})

const defaultStatusText = {
  pending: 'Ожидает подтверждения',
  accepted: 'Принят в работу',
  preparing: 'Готовится',
  delivering: 'Передан курьеру',
  delivered: 'Доставлен',
  cancelled: 'Отменен',
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: loadOrders(),
  reducers: {
    createOrder: (state, action) => {
      const payload = action.payload
      const orderId = payload.id || `CF-${Date.now().toString().slice(-6)}`
      const createdAt = nowIso()
      const order = {
        id: orderId,
        createdAt,
        status: 'pending',
        statusText: defaultStatusText.pending,
        customer: {
          name: payload.name,
          phone: payload.phone,
          email: payload.email || '',
          city: payload.city || '',
          address: payload.address,
        },
        paymentMethod: payload.paymentMethod,
        deliveryDate: payload.deliveryDate || '',
        deliveryTime: payload.deliveryTime,
        totalAmount: payload.totalAmount,
        totalCount: payload.totalCount,
        items: payload.items,
        adminActions: [createAdminAction('pending', 'Заказ создан клиентом')],
        isClosedByAdmin: false,
      }

      state.orders.unshift(order)
      persistOrders(state.orders)
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, note } = action.payload
      const order = state.orders.find((item) => item.id === orderId)
      if (!order) return

      order.status = status
      order.statusText = defaultStatusText[status] || status
      order.adminActions.unshift(createAdminAction(status, note))
      if (status === 'delivered') {
        order.isClosedByAdmin = true
      }
      persistOrders(state.orders)
    },
  },
})

export const { createOrder, updateOrderStatus } = ordersSlice.actions
export default ordersSlice.reducer

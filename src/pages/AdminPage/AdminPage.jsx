import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { loginAdminSuccess, logoutAdmin } from '../../store/slices/adminSlice'
import { updateOrderStatus } from '../../store/slices/ordersSlice'
import { hashPassword } from '../../utils/security'
import './AdminPage.css'

const statusOptions = [
  { value: 'accepted', label: 'Принят в работу' },
  { value: 'preparing', label: 'Готовится' },
  { value: 'delivering', label: 'Передан курьеру' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменен' },
]

const statusMessages = {
  delivered: {
    title: 'Подтвердить "Доставлен"',
    text: 'Точно хотите отметить заказ как "Доставлен"? После этого он закроется в админке.',
  },
  cancelled: {
    title: 'Подтвердить "Отменен"',
    text: 'Точно хотите отменить заказ? Клиент увидит, что заказ отменен со стороны магазина.',
  },
}

const AdminPage = () => {
  const dispatch = useDispatch()
  const { db, isLoggedIn } = useSelector((state) => state.admin)
  const orders = useSelector((state) => state.orders.orders)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notes, setNotes] = useState({})
  const [confirmWidget, setConfirmWidget] = useState(null)

  const sortedOrders = useMemo(
    () => [...orders]
      .filter((order) => !order.isClosedByAdmin)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    const hashed = await hashPassword(password)
    if (username === db.username && hashed === db.passwordHash) {
      dispatch(loginAdminSuccess())
      setError('')
      setPassword('')
      return
    }
    setError('Неверный логин или пароль')
  }

  const applyStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status, note: notes[orderId] || '' }))
    setNotes((prev) => ({ ...prev, [orderId]: '' }))
    toast.success(`Статус заказа обновлен: ${statusOptions.find((item) => item.value === status)?.label || status}`)
  }

  const handleStatusChange = (orderId, status) => {
    if (status === 'delivered' || status === 'cancelled') {
      setConfirmWidget({ orderId, status })
      return
    }
    applyStatusChange(orderId, status)
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="admin-login-card">
            <h1>Закрытая админ-панель</h1>
            <p>Вход только для администратора магазина.</p>
            <form onSubmit={handleLogin} className="admin-login-form">
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error ? <p className="admin-error">{error}</p> : null}
              <button type="submit">Войти</button>
            </form>
            <p className="admin-hint">Пароль хранится в "базе" в виде SHA-256 хеша.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-topbar">
          <h1>Админ-панель заказов</h1>
          <button onClick={() => dispatch(logoutAdmin())}>Выйти</button>
        </div>

        <div className="admin-grid">
          {sortedOrders.length === 0 ? (
            <div className="admin-empty-state">
              Нет активных заказов. Доставленные заказы автоматически закрываются.
            </div>
          ) : sortedOrders.map((order) => (
            <article key={order.id} className="admin-order-card">
              <div className="admin-order-head">
                <h3>#{order.id}</h3>
                <span>{order.statusText}</span>
              </div>
              <p><strong>Клиент:</strong> {order.customer.name}</p>
              <p><strong>Телефон:</strong> {order.customer.phone}</p>
              <p><strong>Город:</strong> {order.customer.city || 'Не указан'}</p>
              <p><strong>Адрес:</strong> {order.customer.address}</p>
              <p><strong>Доставка:</strong> {order.deliveryDate || 'Без даты'} / {order.deliveryTime}</p>
              <p><strong>Сумма:</strong> {order.totalAmount} ₽</p>

              <textarea
                placeholder="Комментарий для истории заказа"
                value={notes[order.id] || ''}
                onChange={(e) => setNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
              />
              <div className="admin-status-actions">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusChange(order.id, status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {confirmWidget ? (
          <motion.div
            className="admin-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                setConfirmWidget(null)
              }
            }}
          >
            <motion.div
              className="admin-confirm-card"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3>{statusMessages[confirmWidget.status].title}</h3>
              <p>{statusMessages[confirmWidget.status].text}</p>
              <div className="admin-confirm-actions">
                <button
                  className="confirm-btn"
                  onClick={() => {
                    applyStatusChange(confirmWidget.orderId, confirmWidget.status)
                    setConfirmWidget(null)
                  }}
                >
                  Да, подтвердить
                </button>
                <button className="cancel-btn" onClick={() => setConfirmWidget(null)}>
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default AdminPage

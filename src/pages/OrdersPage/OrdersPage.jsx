import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import './OrdersPage.css'

const OrdersPage = () => {
  const orders = useSelector((state) => state.orders.orders)
  const [phoneFilter, setPhoneFilter] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  const normalizedOrders = useMemo(() => {
    if (!Array.isArray(orders)) return []
    return orders
      .filter((order) => order && order.id)
      .map((order) => ({
        ...order,
        customer: {
          name: order.customer?.name || 'Клиент',
          phone: order.customer?.phone || '',
          city: order.customer?.city || '',
          address: order.customer?.address || 'Не указан',
        },
        adminActions: Array.isArray(order.adminActions) ? order.adminActions : [],
      }))
  }, [orders])

  const filteredOrders = useMemo(() => {
    const digits = phoneFilter.replace(/\D/g, '')
    if (!digits) return normalizedOrders
    return normalizedOrders.filter((order) => order.customer.phone.replace(/\D/g, '').includes(digits))
  }, [normalizedOrders, phoneFilter])

  const activeOrders = useMemo(
    () => filteredOrders.filter((order) => order.status !== 'delivered'),
    [filteredOrders]
  )
  const completedOrders = useMemo(
    () => filteredOrders.filter((order) => order.status === 'delivered'),
    [filteredOrders]
  )

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header-card">
          <h1>Мои заказы</h1>
          <p>Введите ваш телефон, чтобы быстро найти свои заказы и следить за действиями администратора.</p>
          <input
            type="tel"
            className="orders-filter-input"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            placeholder="Поиск по телефону"
          />
          <div className="orders-tabs">
            <button
              className={activeTab === 'active' ? 'active' : ''}
              onClick={() => setActiveTab('active')}
            >
              Активные ({activeOrders.length})
            </button>
            <button
              className={activeTab === 'completed' ? 'active' : ''}
              onClick={() => setActiveTab('completed')}
            >
              Завершенные ({completedOrders.length})
            </button>
          </div>
        </div>

        <div className="orders-list">
          {displayOrders.length === 0 ? (
            <div className="orders-empty">Заказы не найдены. Проверьте номер или оформите новый заказ.</div>
          ) : (
            displayOrders.map((order) => (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <h3>Заказ #{order.id}</h3>
                    <p>{new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                  </div>
                  <span className={`order-status status-${order.status}`}>{order.statusText}</span>
                </div>

                <div className="order-meta-grid">
                  <p><strong>Клиент:</strong> {order.customer.name}</p>
                  <p><strong>Телефон:</strong> {order.customer.phone}</p>
                  <p><strong>Город:</strong> {order.customer.city || 'Не указан'}</p>
                  <p><strong>Адрес:</strong> {order.customer.address}</p>
                  <p><strong>Доставка:</strong> {order.deliveryDate || 'Без даты'} / {order.deliveryTime}</p>
                  <p><strong>Сумма:</strong> {order.totalAmount} ₽</p>
                </div>

                <div className="order-timeline">
                  <h4>Действия по заказу</h4>
                  {order.adminActions.length === 0 ? (
                    <div className="timeline-item">
                      <div>
                        <strong>pending</strong>
                        <p>История действий пока пуста.</p>
                      </div>
                      <span>—</span>
                    </div>
                  ) : (
                    order.adminActions.map((action) => (
                      <div key={action.id} className="timeline-item">
                        <div>
                          <strong>{action.status}</strong>
                          {action.note ? <p>{action.note}</p> : null}
                        </div>
                        <span>{new Date(action.createdAt).toLocaleString('ru-RU')}</span>
                      </div>
                    ))
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage

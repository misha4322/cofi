import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { clearCart } from '../../store/slices/cartSlice'
import { createOrder } from '../../store/slices/ordersSlice'
import toast from 'react-hot-toast'
import './CheckoutModal.css'

// Простая функция для форматирования телефона
const formatPhoneNumber = (value) => {
  if (!value) return value
  const phoneNumber = value.replace(/[^\d]/g, '')
  const phoneNumberLength = phoneNumber.length
  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 7) {
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`
  }
  if (phoneNumberLength < 9) {
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`
  }
  return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`
}

const getTodayDateString = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().split('T')[0]
}

const CheckoutModal = ({ isOpen, onClose }) => {
  const CHECKOUT_DRAFT_KEY = 'coffeeShopCheckoutDraft'
  const dispatch = useDispatch()
  const { items, totalAmount } = useSelector(state => state.cart)
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    paymentMethod: 'card',
    deliveryDate: '',
    deliveryTime: 'asap',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const today = getTodayDateString()

  useEffect(() => {
    if (!isOpen) return
    try {
      const savedDraft = localStorage.getItem(CHECKOUT_DRAFT_KEY)
      if (!savedDraft) return
      const parsedDraft = JSON.parse(savedDraft)
      setOrderData((prev) => ({ ...prev, ...parsedDraft }))
    } catch {
      // ignore malformed draft
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(orderData))
  }, [orderData, isOpen])

  const resetForm = () => {
    setIsSuccess(false)
    setOrderData({
      name: '',
      phone: '',
      email: '',
      city: '',
      address: '',
      paymentMethod: 'card',
      deliveryDate: '',
      deliveryTime: 'asap',
    })
    setErrors({})
    setOrderNumber('')
    localStorage.removeItem(CHECKOUT_DRAFT_KEY)
  }

  const handleCloseModal = () => {
    resetForm()
    onClose()
  }

  const handleCloseSuccess = () => {
    dispatch(clearCart())
    handleCloseModal()
  }

  const validate = () => {
    const newErrors = {}
    if (!orderData.name.trim()) newErrors.name = 'Введите имя'
    if (!orderData.phone || orderData.phone.replace(/\D/g, '').length < 11) {
      newErrors.phone = 'Введите корректный телефон (11 цифр)'
    }
    if (!orderData.city.trim()) newErrors.city = 'Введите город'
    if (!orderData.address.trim()) newErrors.address = 'Введите адрес'
    if (!orderData.deliveryDate) newErrors.deliveryDate = 'Выберите дату доставки'
    if (orderData.deliveryDate && orderData.deliveryDate < today) {
      newErrors.deliveryDate = 'Нельзя оформить доставку в прошлую дату'
    }
    if (orderData.email && !/\S+@\S+\.\S+/.test(orderData.email)) {
      newErrors.email = 'Некорректный email'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null })
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setOrderData({ ...orderData, phone: formatted })
    if (errors.phone) {
      setErrors({ ...errors, phone: null })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const newOrderId = `CF-${Date.now().toString().slice(-6)}`
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    dispatch(createOrder({
      id: newOrderId,
      name: orderData.name,
      phone: orderData.phone,
      email: orderData.email,
      city: orderData.city,
      address: orderData.address,
      paymentMethod: orderData.paymentMethod,
      deliveryDate: orderData.deliveryDate,
      deliveryTime: orderData.deliveryTime,
      totalAmount,
      totalCount: items.reduce((acc, item) => acc + item.quantity, 0),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }))
    setIsSubmitting(false)
    setIsSuccess(true)
    setOrderNumber(newOrderId)

    toast.success('Заказ оформлен! Спасибо за покупку!')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
      >
        <motion.div
          className="checkout-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {!isSuccess ? (
            <>
              <div className="modal-header">
                <h2>Оформление заказа</h2>
                <button className="close-btn" onClick={handleCloseModal}>×</button>
              </div>

              <div className="modal-content">
                <div className="order-summary">
                  <h3>Ваш заказ</h3>
                  {items.map(item => (
                    <div key={item.id} className="order-item">
                      <span>{item.name}</span>
                      <span>{item.quantity} × {item.price} ₽</span>
                    </div>
                  ))}
                  <div className="order-total">
                    <strong>Итого: {totalAmount} ₽</strong>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="checkout-form">
                  <div className="form-group">
                    <label>Имя и фамилия *</label>
                    <input
                      type="text"
                      name="name"
                      value={orderData.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Телефон *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+7 (___) ___-__-__"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={orderData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Город *</label>
                    <input
                      type="text"
                      name="city"
                      value={orderData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                      placeholder="Например: Москва"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>Адрес доставки *</label>
                    <textarea
                      name="address"
                      value={orderData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-group">
                    <label>Способ оплаты</label>
                    <select name="paymentMethod" value={orderData.paymentMethod} onChange={handleInputChange}>
                      <option value="card">Картой онлайн</option>
                      <option value="cash">Наличными при получении</option>
                      <option value="card-courier">Картой курьеру</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Дата доставки *</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={orderData.deliveryDate}
                      onChange={handleInputChange}
                      className={errors.deliveryDate ? 'error' : ''}
                      min={today}
                    />
                    {errors.deliveryDate && <span className="error-text">{errors.deliveryDate}</span>}
                  </div>

                  <div className="form-group">
                    <label>Время доставки</label>
                    <select name="deliveryTime" value={orderData.deliveryTime} onChange={handleInputChange}>
                      <option value="asap">Как можно скорее</option>
                      <option value="10-12">10:00 - 12:00</option>
                      <option value="12-14">12:00 - 14:00</option>
                      <option value="14-16">14:00 - 16:00</option>
                      <option value="16-18">16:00 - 18:00</option>
                      <option value="18-20">18:00 - 20:00</option>
                    </select>
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Оформляем...' : 'Подтвердить заказ'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <motion.div
              className="success-message"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <div className="success-icon">✓</div>
              <h2>Заказ оформлен!</h2>
              <p>Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.</p>
              <p>Номер вашего заказа: <strong>#{orderNumber}</strong></p>
              <p className="success-code">Уникальный код заказа: <strong>{orderNumber}</strong></p>
              <div className="success-details">
                <p>Сумма: <strong>{totalAmount} ₽</strong></p>
                <p>Город: <strong>{orderData.city}</strong></p>
                <p>Дата и время доставки: <strong>{orderData.deliveryDate} / {orderData.deliveryTime}</strong></p>
                <p>Способ оплаты: <strong>{
                  orderData.paymentMethod === 'card' ? 'Картой онлайн' :
                  orderData.paymentMethod === 'cash' ? 'Наличными' :
                  'Картой курьеру'
                }</strong></p>
              </div>
              <button className="submit-btn close-order-btn" onClick={handleCloseSuccess}>
                Закрыть заказ
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CheckoutModal
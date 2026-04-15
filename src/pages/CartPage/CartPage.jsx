import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CheckoutModal from '../../components/CheckoutModal/CheckoutModal'
import './CartPage.css'

const CartPage = () => {
  const { items, totalAmount, totalCount } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleCheckout = () => {
    if (items.length > 0) {
      setIsCheckoutModalOpen(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Корзина пуста</h1>
          <div className="empty-cart">
            <p>В вашей корзине пока нет товаров</p>
            <Link to="/catalog" className="continue-shopping">
              Перейти к покупкам
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="cart-page">
        <div className="container">
          <motion.div
            className="cart-header"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Корзина</h1>
            <button onClick={handleClearCart} className="clear-cart-btn">
              Очистить корзину
            </button>
          </motion.div>

          <div className="cart-content">
            <div className="cart-items">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-meta">
                        <span>{item.roast} обжарка</span>
                        <span>{item.weight}g</span>
                      </div>
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-price">
                      {item.price * item.quantity} ₽
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              className="cart-summary"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h2>Итого</h2>
              <div className="summary-row">
                <span>Товары ({totalCount}):</span>
                <span>{totalAmount} ₽</span>
              </div>
              <div className="summary-row">
                <span>Доставка:</span>
                <span>Бесплатно</span>
              </div>
              <div className="summary-row total">
                <span>Общая сумма:</span>
                <span>{totalAmount} ₽</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Оформить заказ
              </button>

              <Link to="/catalog" className="continue-shopping">
                Продолжить покупки
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </>
  )
}

export default CartPage
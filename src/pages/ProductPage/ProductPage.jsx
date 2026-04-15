import { useParams, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addToCart } from '../../store/slices/cartSlice'
import { toggleFavorite } from '../../store/slices/favoritesSlice'
import toast from 'react-hot-toast'
import './ProductPage.css'

const ProductPage = () => {
  const { id } = useParams()
  const products = useSelector(state => state.products.products)
  const favorites = useSelector(state => state.favorites.items)
  const dispatch = useDispatch()

  const product = products.find(p => p.id === parseInt(id))
  const [activeTab, setActiveTab] = useState('description')
  const isFavorite = favorites.some(f => f.id === product?.id)

  if (!product) {
    return <Navigate to="/catalog" replace />
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    toast.success(`${product.name} добавлен в корзину!`)
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product))
    toast(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное', {
      icon: isFavorite ? '💔' : '❤️',
    })
  }

  return (
    <div className="product-page">
      <div className="container">
        <motion.div
          className="product-detail"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="product-image"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              <button
                className={`favorite-btn-large ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '❤️' : '🤍'} В избранное
              </button>
            </div>
            <div className="product-meta">
              <span className="roast">{product.roast} обжарка</span>
              <span className="weight">{product.weight}g</span>
              <span className="category">
                {product.category === 'single-origin' ? 'Моносорт' : 'Смесь'}
              </span>
            </div>

            <div className="product-rating-large">
              <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              <span className="rating-value">{product.rating} / 5</span>
              <span className="reviews-count">({product.reviews?.length || 0} отзывов)</span>
            </div>

            <div className="product-tabs">
              <button
                className={activeTab === 'description' ? 'active' : ''}
                onClick={() => setActiveTab('description')}
              >
                Описание
              </button>
              <button
                className={activeTab === 'details' ? 'active' : ''}
                onClick={() => setActiveTab('details')}
              >
                Детали
              </button>
              <button
                className={activeTab === 'reviews' ? 'active' : ''}
                onClick={() => setActiveTab('reviews')}
              >
                Отзывы
              </button>
            </div>

            <div className="tab-content">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.p
                    key="desc"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="product-description"
                  >
                    {product.description}
                  </motion.p>
                )}
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="product-features"
                  >
                    <ul>
                      <li>Страна: {product.name.split(' ')[0]}</li>
                      <li>Высота произрастания: 1200-1800 м</li>
                      <li>Обработка: мытая</li>
                      <li>Упаковка: с дегазационным клапаном</li>
                    </ul>
                  </motion.div>
                )}
                {activeTab === 'reviews' && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="reviews-section"
                  >
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, idx) => (
                        <div key={idx} className="review-item">
                          <div className="review-header">
                            <strong>{review.user}</strong>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p>{review.text}</p>
                        </div>
                      ))
                    ) : (
                      <p>Пока нет отзывов. Будьте первым!</p>
                    )}
                    <button className="add-review-btn">Написать отзыв</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="price-section">
              <div className="price">{product.price} ₽</div>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Добавить в корзину
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductPage
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import './HomePage.css'

const HomePage = () => {
  const products = useSelector(state => state.products.products)
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Наслаждайтесь идеальным кофе</h1>
          <p>Отборные сорта со всего мира с доставкой до двери</p>
          <Link to="/catalog" className="cta-button">
            Выбрать кофе
          </Link>
        </div>
        <div className="hero-image">
          <div className="coffee-cup">
            <img src="/images/products/cofe.png" alt="Чашка кофе" className="cofe" />
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Почему выбирают нас</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon"><img src="/images/products/cofei.png" alt="Свежая обжарка" /></div>
              <h3>Свежая обжарка</h3>
              <p>Обжариваем кофе каждую неделю</p>
            </div>
            <div className="feature">
              <div className="feature-icon"><img src="/images/products/gruz.png" alt="Быстрая доставка" /></div>
              <h3>Быстрая доставка</h3>
              <p>Доставляем за 1-2 дня по всей стране</p>
            </div>
            <div className="feature">
              <div className="feature-icon"><img src="/images/products/zvezda.png" alt="Проверенное качество" /></div>
              <h3>Проверенное качество</h3>
              <p>Только лучшие зерна от проверенных фермеров</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Популярные сорта</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <motion.div
                key={product.id}
                className="product-card"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-price">{product.price} ₽</div>
                  <Link to={`/product/${product.id}`} className="view-button">
                    Подробнее
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="view-all">
            <Link to="/catalog" className="view-all-button">
              Смотреть весь каталог
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
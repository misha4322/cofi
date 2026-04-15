import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import './Header.css'

const Header = () => {
  const { totalCount } = useSelector(state => state.cart)

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container">
        <Link to="/" className="logo">
          <img src="/images/products/logo.png" className="logoi" alt="CoffeeShop" />
          <span>CoffeeShop</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/catalog" className="nav-link">Каталог</Link>
          <Link to="/orders" className="nav-link">Мои заказы</Link>
          <Link to="/about" className="nav-link">О нас</Link>
          <Link to="/contacts" className="nav-link">Контакты</Link>
        </nav>

        <Link to="/cart" className="cart-link">
          <img src="/images/products/iconc.png" className="iconc" alt="Корзина" />
          <span>Корзина</span>
          {totalCount > 0 && (
            <motion.span
              className="cart-count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              {totalCount}
            </motion.span>
          )}
        </Link>
      </div>
    </motion.header>
  )
}

export default Header
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <img src="/images/products/logo.png" className="iphone" alt="Logo" />
              CoffeeShop
            </h3>
            <p>Лучший кофе с доставкой до двери. Наслаждайтесь качеством в каждой чашке.</p>
          </div>

          <div className="footer-section">
            <h4>Контакты</h4>
            <p><img src="/images/products/iphone.png" className="iphone" alt="" /> +7 (999) 123-45-67</p>
            <p><img src="/images/products/email.png" className="iphone" alt="" /> info@coffeeshop.ru</p>
            <p><img src="/images/products/adres.png" className="iphone" alt="" /> Москва, ул. Кофейная, 15</p>
          </div>

          <div className="footer-section">
            <h4>Часы работы</h4>
            <p>Пн-Пт: 9:00 - 21:00</p>
            <p>Сб-Вс: 10:00 - 20:00</p>
          </div>

          <div className="footer-section">
            <h4>Навигация</h4>
            <Link to="/catalog">Каталог</Link>
            <Link to="/about">О нас</Link>
            <Link to="/contacts">Контакты</Link>
            <Link to="/cart">Корзина</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CoffeeShop. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
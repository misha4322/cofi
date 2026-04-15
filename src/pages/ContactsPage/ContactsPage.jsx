import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import './ContactsPage.css'

const ContactsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="contacts-page">
      <div className="container">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Контакты
        </motion.h1>

        <div className="contacts-grid">
          <motion.div
            className="contact-info"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2>Свяжитесь с нами</h2>
            <div className="info-item">
              <span className="icon">📍</span>
              <p>Москва, ул. Кофейная, 15</p>
            </div>
            <div className="info-item">
              <span className="icon">📞</span>
              <p>+7 (999) 123-45-67</p>
            </div>
            <div className="info-item">
              <span className="icon">✉️</span>
              <p>info@coffeeshop.ru</p>
            </div>
            <div className="info-item">
              <span className="icon">🕒</span>
              <p>Пн-Пт: 9:00 - 21:00<br />Сб-Вс: 10:00 - 20:00</p>
            </div>

            <div className="map-container">
              <iframe
                title="Карта"
                src="https://yandex.ru/map-widget/v1/?ll=37.620070%2C55.753630&z=12&pt=37.620070,55.753630,pm2rdl"
                width="100%"
                height="250"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-container"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h2>Напишите нам</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Ваше сообщение"
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Отправить
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ContactsPage
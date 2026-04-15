import { motion } from 'framer-motion'
import './AboutPage.css'

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <motion.div
          className="about-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1>О CoffeeShop</h1>
          <p>Мы делаем кофе особенным с 2010 года</p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Наша история</h2>
            <p>
              CoffeeShop начался с маленькой обжарочной мастерской в центре Москвы.
              Сегодня мы поставляем свежеобжаренный кофе по всей стране, сотрудничая
              напрямую с фермерами из Эфиопии, Колумбии, Бразилии и других стран.
            </p>
            <h2>Наша миссия</h2>
            <p>
              Показать, что качественный кофе доступен каждому. Мы обжариваем зерна
              небольшими партиями, чтобы сохранить уникальный вкус и аромат каждого сорта.
            </p>
          </motion.div>

          <motion.div
            className="about-image"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img src="/images/products/roastery.jpg" alt="Наша обжарочная" />
          </motion.div>
        </div>

        <div className="team-section">
          <h2>Наша команда</h2>
          <div className="team-grid">
            {[
              { name: 'Алексей Смирнов', role: 'Основатель, главный обжарщик', img: 'images/products/alex.jpg' },
              { name: 'Мария Иванова', role: 'Руководитель отдела качества', img: 'images/products/maria.jpg' },
              { name: 'Дмитрий Козлов', role: 'Бариста-тренер', img: 'images/products/dmitry.jpg' }
            ].map((member, i) => (
              <motion.div
                key={i}
                className="team-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="team-img">
                  <img src={member.img} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
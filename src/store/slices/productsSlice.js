import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [
    {
      id: 1,
      name: "Эфиопия Иргачеф",
      price: 1200,
      image: "/images/products/ethiopia.png",
      description: "Яркий вкус с нотками цитрусов и жасмина",
      roast: "Светлая",
      weight: 250,
      category: "single-origin",
      rating: 4.8,
      reviews: [
        { user: "Анна", text: "Великолепный аромат, очень свежий кофе!", date: "2024-05-10" },
        { user: "Михаил", text: "Лучший эфиопский кофе, который я пробовал.", date: "2024-06-02" }
      ]
    },
    {
      id: 2,
      name: "Колумбия Супремо",
      price: 950,
      image: "/images/products/colombia.png",
      description: "Сбалансированный вкус с шоколадными нотами",
      roast: "Средняя",
      weight: 250,
      category: "single-origin",
      rating: 4.6,
      reviews: [
        { user: "Елена", text: "Мягкий, приятный кофе на каждый день.", date: "2024-07-15" }
      ]
    },
    {
      id: 3,
      name: "Бурбон",
      price: 850,
      image: "/images/products/italian.png",
      description: "Интенсивный и насыщенный эспрессо",
      roast: "Тёмная",
      weight: 250,
      category: "blends",
      rating: 4.9,
      reviews: [
        { user: "Дмитрий", text: "Отличная смесь для эспрессо, плотное тело.", date: "2024-08-01" }
      ]
    },
    {
      id: 4,
      name: "Бразилия Сантос",
      price: 1780,
      image: "/images/products/brazil.png",
      description: "Мягкий вкус с ореховыми нотами",
      roast: "Средняя",
      weight: 1000,
      category: "single-origin",
      rating: 4.5,
      reviews: []
    },
    {
      id: 5,
      name: "Кения AA",
      price: 1350,
      image: "/images/products/kenya.png",
      description: "Яркий вкус с ягодными и винными нотами",
      roast: "Светлая",
      weight: 250,
      category: "single-origin",
      rating: 4.7,
      reviews: []
    },
    {
      id: 6,
      name: "Гватемала Антигуа",
      price: 1100,
      image: "/images/products/guatemala.png",
      description: "Шоколадный вкус с цветочными оттенками",
      roast: "Средняя",
      weight: 250,
      category: "single-origin",
      rating: 4.6,
      reviews: []
    },
    {
      id: 7,
      name: "Вьетнам Далат",
      price: 650,
      image: "/images/products/vietnam.png",
      description: "Плотный вкус с пряными нотами",
      roast: "Тёмная",
      weight: 250,
      category: "single-origin",
      rating: 4.3,
      reviews: []
    },
    {
      id: 8,
      name: "Коста-Рика Тарразу",
      price: 1250,
      image: "/images/products/costa-rica.png",
      description: "Нежный вкус с карамельными нотами",
      roast: "Средняя",
      weight: 250,
      category: "single-origin",
      rating: 4.8,
      reviews: []
    },
    {
      id: 9,
      name: "Эфиопия Сидамо",
      price: 1150,
      image: "/images/products/ethiopia-sidamo.png",
      description: "Цветочный аромат с ягодными нотами",
      roast: "Светлая",
      weight: 250,
      category: "single-origin",
      rating: 4.7,
      reviews: []
    }
  ],
  selectedProduct: null
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
  },
})

export const { setSelectedProduct } = productsSlice.actions
export default productsSlice.reducer
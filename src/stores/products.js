import { defineStore } from 'pinia';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      {
        id: 'panther-core',
        name: 'Panther Core',
        price: 1999,
        image: '🔥',
        imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
        images: [
          'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1579758682665-53a1a614eea6?w=600&h=600&fit=crop',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
        ],
        description: 'Balanced intensity for consistent performance. Perfect for daily training.',
        ingredients: [
          { name: 'Caffeine', amount: '250mg', benefit: 'Balanced Energy' },
          { name: 'Citrulline Malate', amount: '5g', benefit: 'Muscle Pumps' },
          { name: 'Beta-Alanine', amount: '2.5g', benefit: 'Extended Sets' },
          { name: 'Creatine Monohydrate', amount: '1.5g', benefit: 'Strength' }
        ],
        servings: 30,
        rating: 4.8,
        reviews: 342,
        inStock: true,
        available: true
      },
      {
        id: 'panther-extreme',
        name: 'Panther Extreme',
        price: 2499,
        image: '⚡',
        imageUrl: 'https://images.unsplash.com/photo-1579758682665-53a1a614eea6?w=400&h=400&fit=crop',
        images: [],
        description: 'Maximum intensity formula for extreme training sessions.',
        ingredients: [
          { name: 'Caffeine', amount: '400mg', benefit: 'Maximum Energy' },
          { name: 'Citrulline Malate', amount: '8g', benefit: 'Intense Pumps' },
          { name: 'Beta-Alanine', amount: '3.5g', benefit: 'Endurance' },
          { name: 'Creatine Monohydrate', amount: '2.5g', benefit: 'Max Strength' }
        ],
        servings: 30,
        rating: 4.7,
        reviews: 198,
        inStock: false,
        available: false
      },
      {
        id: 'panther-elite',
        name: 'Panther Elite',
        price: 2999,
        image: '💎',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        images: [],
        description: 'Premium formula with advanced ingredients for elite athletes.',
        ingredients: [
          { name: 'Caffeine Anhydrous', amount: '300mg', benefit: 'Pure Energy' },
          { name: 'Citrulline Malate', amount: '10g', benefit: 'Elite Pumps' },
          { name: 'Beta-Alanine', amount: '4g', benefit: 'Peak Performance' },
          { name: 'Creatine Monohydrate', amount: '3g', benefit: 'Elite Strength' }
        ],
        servings: 40,
        rating: 4.9,
        reviews: 287,
        inStock: false,
        available: false
      }
    ]
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(p => p.id === id);
    },

    allProducts: (state) => state.products,

    availableProducts: (state) => state.products.filter(p => p.available),

    comingSoonProducts: (state) => state.products.filter(p => !p.available),
  }
});
export const ingredientGlossary = {
  'caffeine': {
    title: 'Caffeine Anhydrous',
    description: 'Pure, water-free caffeine that rapidly increases alertness, focus, and energy. Enhances physical performance by mobilizing fat stores and reducing perceived exertion during intense workouts.'
  },
  'citrulline malate': {
    title: 'Citrulline Malate',
    description: 'Amino acid that boosts nitric oxide production, increasing blood flow to muscles. Results in massive pumps, improved nutrient delivery, and faster recovery between sets.'
  },
  'beta-alanine': {
    title: 'Beta-Alanine',
    description: 'Increases muscle carnosine levels, buffering lactic acid buildup. This delays muscle fatigue, allowing you to push harder for longer. May cause harmless tingling sensation (paresthesia).'
  },
  'creatine monohydrate': {
    title: 'Creatine Monohydrate',
    description: 'The gold standard for strength and power. Increases ATP production for explosive movements, enhances muscle volume, and supports muscle growth. Clinically proven and safe.'
  },
  'l-theanine': {
    title: 'L-Theanine',
    description: 'Natural amino acid that promotes calm focus without drowsiness. Works synergistically with caffeine to provide smooth, jitter-free energy and enhanced cognitive performance.'
  },
  'taurine': {
    title: 'Taurine',
    description: 'Supports cellular hydration, regulates muscle contractions, and protects against oxidative stress. Enhances endurance and reduces muscle damage during intense training.'
  }
}

export function getIngredientInfo(ingredientName) {
  const key = ingredientName.toLowerCase().trim()
  return ingredientGlossary[key] || null
}
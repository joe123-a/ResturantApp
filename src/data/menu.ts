import {MenuItem} from '../types';

export const menu: MenuItem[] = [
  {id: 'burger', name: 'Classic Burger', description: 'Juicy beef, aged cheddar, crisp lettuce, tomato and our house sauce.', category: 'Mains', price: 12.5, emoji: '🍔', popular: true},
  {id: 'pizza', name: 'Margherita Pizza', description: 'Wood-fired crust, rich tomato, fresh mozzarella and basil.', category: 'Mains', price: 14, emoji: '🍕', popular: true},
  {id: 'garden-bowl', name: 'Garden Bowl', description: 'Avocado, seasonal greens, grains, cucumber and lemon dressing.', category: 'Mains', price: 10.5, emoji: '🥗', popular: true},
  {id: 'chicken-wrap', name: 'Crispy Chicken Wrap', description: 'Golden chicken, crunchy slaw and smoky mayo in a toasted wrap.', category: 'Mains', price: 11.75, emoji: '🌯'},
  {id: 'fries', name: 'Truffle Parmesan Fries', description: 'Crispy hand-cut fries finished with parmesan and truffle oil.', category: 'Sides', price: 5.5, emoji: '🍟'},
  {id: 'wings', name: 'Sticky BBQ Wings', description: 'Tender wings glazed with our slow-cooked smoky BBQ sauce.', category: 'Sides', price: 8.5, emoji: '🍗'},
  {id: 'lemonade', name: 'Fresh Lemonade', description: 'Freshly squeezed lemons, a touch of sweetness and lots of ice.', category: 'Drinks', price: 3.5, emoji: '🍋'},
  {id: 'milkshake', name: 'Vanilla Milkshake', description: 'Rich vanilla bean ice cream blended until perfectly smooth.', category: 'Drinks', price: 5, emoji: '🥤'},
  {id: 'brownie', name: 'Warm Chocolate Brownie', description: 'Fudgy chocolate brownie served with a little extra love.', category: 'Desserts', price: 6, emoji: '🍫'},
];

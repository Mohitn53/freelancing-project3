import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: 'c:/Users/Mohit/Downloads/freelancing-main-main/freelancing-project3/backend/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log('🚀 Starting Grocery Seeding...');

  // 1. Clear existing data (Order depends on foreign keys)
  await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('wishlist_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('🗑️  Cleared old data.');

  // 2. Insert Categories
  const categories = [
    { name: 'Vegetables' },
    { name: 'Fruits' },
    { name: 'Dairy & Eggs' },
    { name: 'Bakery' },
    { name: 'Meat & Seafood' },
    { name: 'Pantry' }
  ];
  await supabase.from('categories').insert(categories);
  console.log('📂 Inserted Categories.');

  // 3. Insert Products
  const products = [
    {
      name: 'Organic Roma Tomatoes',
      description: 'Hand-picked organic tomatoes, perfect for salads and sauces. Rich in Lycopene.',
      price: 120.00,
      category: 'Vegetables',
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Fresh Spinach (250g)',
      description: 'Crispy and nutrient-dense green spinach leaves. Sourced from local organic farms.',
      price: 45.00,
      category: 'Vegetables',
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Hass Avocado (Pair)',
      description: 'Creamy Hass avocados, perfectly ripe for your toast or guacamole.',
      price: 299.00,
      category: 'Fruits',
      stock: 20,
      image_url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b56d?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Sweet Alphonso Mangoes',
      description: 'The king of mangoes. Extremely sweet and pulpy. Seasonal special.',
      price: 850.00,
      category: 'Fruits',
      stock: 15,
      image_url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Whole Wheat Sourdough',
      description: 'Artisanal sourdough bread baked daily with natural yeast and whole grains.',
      price: 180.00,
      category: 'Bakery',
      stock: 10,
      image_url: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Farm Fresh Large Eggs (12)',
      description: 'Free-range brown eggs, rich in protein and Omega-3.',
      price: 110.00,
      category: 'Dairy & Eggs',
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Organic Whole Milk (1L)',
      description: 'Pure organic cow milk, pasteurized and homogenized. No preservatives.',
      price: 75.00,
      category: 'Dairy & Eggs',
      stock: 25,
      image_url: 'https://images.unsplash.com/photo-1550583724-125581cc25fb?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Atlantic Salmon Fillet',
      description: 'Freshly caught Atlantic salmon, skin-on. Rich in Omega-3 fatty acids.',
      price: 1450.00,
      category: 'Meat & Seafood',
      stock: 12,
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop'
    }
  ];

  await supabase.from('products').insert(products);
  console.log('🍎 Inserted Products.');
  console.log('✅ Seeding Complete!');
}

seed();

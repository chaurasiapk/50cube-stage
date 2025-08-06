const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Lane = require('./models/Lane');
const Metrics = require('./models/Metrics');

// Connect to MongoDB using URI from environment variable or fallback
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/50cube')
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase(); // Start seeding after successful connection
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Seed the database with initial mock data
async function seedDatabase() {
  try {
    // 1. CLEAR existing data for clean slate
    await User.deleteMany({});
    await Product.deleteMany({});
    await Lane.deleteMany({});
    await Metrics.deleteMany({});

    // 2. CREATE admin and regular users
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@50cube.com',
      credits: 5000,
      isAdmin: true,
    });

    const regularUser = new User({
      name: 'Maya Johnson',
      email: 'maya@50cube.com',
      credits: 1250,
      isAdmin: false,
    });

    // 3. CREATE sample products for merch catalog
    const products = [
      {
        name: '50cube T-Shirt',
        description: 'Premium cotton t-shirt with 50cube logo',
        price: 24.99,
        image: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTKNH26KbJzxGFSlnonlGEwolq7Qwf9ib4RbEvhhmXmQScdJf7n1_CVLC14d7JMeeSpG8uqYhNdqRwupwJ0xTXXlIuoxFAy5e6zaS3Dvcs',
      },
      {
        name: '50cube Hoodie',
        description: 'Comfortable hoodie with 50cube branding',
        price: 49.99,
        image: 'https://fomo21.com/cdn/shop/products/spod-1058956264-648-1_1296x.png?v=1650457013',
      },
      {
        name: '50cube Water Bottle',
        description: 'Stainless steel water bottle with 50cube logo',
        price: 19.99,
        image: 'https://www.versace.com/dw/image/v2/BGWN_PRD/on/demandware.static/-/Sites-ver-master-catalog/default/dw1a95a0b3/original/90_1017926-1A11960_1B000_20_Medusa95WaterBottleSet-Sport~~Travel-Versace-online-store_0_2.jpg?sw=850&q=85&strip=true',
      },
    ];

    // 4. CREATE lanes with random states and metrics
    const lanes = [];
    for (let i = 1; i <= 20; i++) {
      const states = ['ok', 'watchlist', 'save', 'archive'];
      const randomState = states[Math.floor(Math.random() * states.length)];

      lanes.push({
        name: `Lane ${i}`,
        description: `Description for Lane ${i}`,
        impactScore: Math.floor(Math.random() * 100),
        state: randomState,
        metrics: {
          users: Math.floor(Math.random() * 1000) + 100,
          engagement: Math.floor(Math.random() * 100),
          retention: Math.floor(Math.random() * 100),
        },
      });
    }

    // 5. CREATE 30 days of sample metrics
    const metrics = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i); // go back i days

      metrics.push({
        date,
        bursts: Math.floor(Math.random() * 1000) + 500,
        wins: Math.floor(Math.random() * 200) + 50,
        purchases: Math.floor(Math.random() * 100) + 20,
        redemptions: Math.floor(Math.random() * 50) + 10,
        referrals: Math.floor(Math.random() * 30) + 5,
      });
    }

    // 6. SAVE all the created data to MongoDB
    await User.insertMany([adminUser, regularUser]);
    await Product.insertMany(products);
    await Lane.insertMany(lanes);
    await Metrics.insertMany(metrics);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

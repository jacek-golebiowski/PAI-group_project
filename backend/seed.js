require('dotenv').config();
const sequelize = require('./config/db');
const Category = require('./models/Category');
const Product  = require('./models/Product');

async function seed() {
  try {
    await sequelize.sync({ alter: true });

    const categoriesData = [
      { name: 'Bikes', description: 'Mountain, road, and city bikes' },
      { name: 'Skis', description: 'Downhill and cross-country skis' },
      { name: 'Tennis Rackets', description: 'Tennis gear for all levels' },
      { name: 'Scooters', description: 'Manual and electric scooters' },
      { name: 'Camping Gear', description: 'Tents, sleeping bags, and more' },
      { name: 'Water Sports', description: 'Kayaks, SUP boards, and wetsuits' },
      { name: 'Winter Accessories', description: 'Helmets, poles, and gloves' },
    ];
    await Category.bulkCreate(categoriesData, { ignoreDuplicates: true });

    const cats = await Category.findAll();

    const productsData = [
      // BIKES
      {
        name: 'MTB 29" Mountain Bike',
        description: 'Light aluminum frame, 21 gears.',
        price: 50.00, stock: 5,
        categoryId: cats.find(c => c.name === 'Bikes').id
      },
      {
        name: 'Ultra Road Bike',
        description: 'Carbon frame, 18 gears.',
        price: 60.00, stock: 3,
        categoryId: cats.find(c => c.name === 'Bikes').id
      },
      {
        name: 'City Cruiser Bike',
        description: 'Comfortable saddle, upright posture.',
        price: 35.00, stock: 6,
        categoryId: cats.find(c => c.name === 'Bikes').id
      },

      // SKIS
      {
        name: 'Head Supershape Skis',
        description: '170 cm length, Marker bindings.',
        price: 40.00, stock: 8,
        categoryId: cats.find(c => c.name === 'Skis').id
      },
      {
        name: 'Fischer Cross-Country Skis',
        description: 'Lightweight classic skis, 200 cm.',
        price: 35.00, stock: 6,
        categoryId: cats.find(c => c.name === 'Skis').id
      },
      {
        name: 'Junior Ski Set',
        description: 'Perfect for kids aged 8–12.',
        price: 20.00, stock: 4,
        categoryId: cats.find(c => c.name === 'Skis').id
      },

      // TENNIS RACKETS
      {
        name: 'Wilson Pro Staff Racket',
        description: 'Weight: 310g, balance: 31 cm.',
        price: 30.00, stock: 10,
        categoryId: cats.find(c => c.name === 'Tennis Rackets').id
      },
      {
        name: 'Babolat Pure Drive Racket',
        description: 'Power and precision combined.',
        price: 32.00, stock: 7,
        categoryId: cats.find(c => c.name === 'Tennis Rackets').id
      },
      {
        name: 'Head Junior Racket',
        description: 'Shorter grip, for ages 7–11.',
        price: 20.00, stock: 5,
        categoryId: cats.find(c => c.name === 'Tennis Rackets').id
      },

      // SCOOTERS
      {
        name: 'Manual Scooter',
        description: 'Folding aluminum frame, 8" wheels.',
        price: 15.00, stock: 12,
        categoryId: cats.find(c => c.name === 'Scooters').id
      },
      {
        name: 'Electric Scooter',
        description: 'Range: 25 km, speed up to 20 km/h.',
        price: 25.00, stock: 4,
        categoryId: cats.find(c => c.name === 'Scooters').id
      },
      {
        name: 'Off-road Scooter',
        description: 'Chunky tires, mountain trails ready.',
        price: 28.00, stock: 3,
        categoryId: cats.find(c => c.name === 'Scooters').id
      },

      // CAMPING GEAR
      {
        name: '2-Person Tent',
        description: 'Waterproof, quick setup.',
        price: 18.00, stock: 6,
        categoryId: cats.find(c => c.name === 'Camping Gear').id
      },
      {
        name: 'Sleeping Bag – -10°C',
        description: 'Warm and compact.',
        price: 12.00, stock: 10,
        categoryId: cats.find(c => c.name === 'Camping Gear').id
      },
      {
        name: 'Camping Stove',
        description: 'Portable gas burner.',
        price: 8.00, stock: 7,
        categoryId: cats.find(c => c.name === 'Camping Gear').id
      },

      // WATER SPORTS
      {
        name: 'Inflatable Kayak',
        description: '2-person, includes paddles.',
        price: 45.00, stock: 2,
        categoryId: cats.find(c => c.name === 'Water Sports').id
      },
      {
        name: 'SUP Paddle Board',
        description: 'Inflatable, includes leash & pump.',
        price: 40.00, stock: 5,
        categoryId: cats.find(c => c.name === 'Water Sports').id
      },
      {
        name: 'Wetsuit – Adult M',
        description: '5mm neoprene, warm and flexible.',
        price: 20.00, stock: 6,
        categoryId: cats.find(c => c.name === 'Water Sports').id
      },

      // WINTER ACCESSORIES
      {
        name: 'Ski Helmet',
        description: 'Size M, certified protection.',
        price: 10.00, stock: 10,
        categoryId: cats.find(c => c.name === 'Winter Accessories').id
      },
      {
        name: 'Ski Poles',
        description: 'Aluminum, adjustable height.',
        price: 5.00, stock: 12,
        categoryId: cats.find(c => c.name === 'Winter Accessories').id
      },
      {
        name: 'Thermal Gloves',
        description: 'Waterproof, breathable.',
        price: 6.00, stock: 8,
        categoryId: cats.find(c => c.name === 'Winter Accessories').id
      }
    ];

    await Product.bulkCreate(productsData, { ignoreDuplicates: true });

    console.log('👌 Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('‼ Database seeding failed:', err);
    process.exit(1);
  }
}

seed();

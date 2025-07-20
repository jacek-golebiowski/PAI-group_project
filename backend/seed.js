require('dotenv').config();
const bcrypt   = require('bcrypt');
const sequelize = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User     = require('./models/User');

async function seed() {
  try {
    const isDevelopmentOrTest = ['development', 'test'].includes(process.env.NODE_ENV);
    await sequelize.sync({ force: isDevelopmentOrTest, alter: !isDevelopmentOrTest });
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
      {
        name: 'MTB 29" Mountain Bike',
        description: 'Light aluminum frame, 21 gears.',
        price: 50.0, stock: 5,
        categoryId: cats.find(c => c.name === 'Bikes').id,
        imageName: 'mountain-bike.jpg'
      },
      {
        name: 'Ultra Road Bike',
        description: 'Carbon frame, 18 gears.',
        price: 60.0, stock: 3,
        categoryId: cats.find(c => c.name === 'Bikes').id,
        imageName: 'ultra-road-bike.jpg'
      },
      {
        name: 'City Cruiser Bike',
        description: 'Comfortable saddle, upright posture.',
        price: 35.0, stock: 6,
        categoryId: cats.find(c => c.name === 'Bikes').id,
        imageName: 'City Cruiser Bike.jpg'
      },

      {
        name: 'Head Supershape Skis',
        description: '170 cm length, Marker bindings.',
        price: 40.0, stock: 8,
        categoryId: cats.find(c => c.name === 'Skis').id,
        imageName: 'Head Supershape Skis.jpg'
      },
      {
        name: 'Fischer Cross-Country Skis',
        description: 'Lightweight classic skis, 200 cm.',
        price: 35.0, stock: 6,
        categoryId: cats.find(c => c.name === 'Skis').id,
        imageName: 'Fischer Cross-Country Skis.jpg'
      },
      {
        name: 'Junior Ski Set',
        description: 'Perfect for kids aged 8–12.',
        price: 20.0, stock: 4,
        categoryId: cats.find(c => c.name === 'Skis').id,
        imageName: 'Junior Ski Set.jpg'
      },

      {
        name: 'Wilson Pro Staff Racket',
        description: 'Weight: 310g, balance: 31 cm.',
        price: 30.0, stock: 10,
        categoryId: cats.find(c => c.name === 'Tennis Rackets').id,
        imageName: 'Wilson Pro Staff Racket.jpg'
      },
      {
        name: 'Babolat Pure Drive Racket',
        description: 'Power and precision combined.',
        price: 32.0, stock: 7,
        categoryId: cats.find(c => c.name === 'Tennis Rackets').id,
        imageName: 'Babolat Pure Drive Racket.jpg'
      },
      {
        name: 'Head Junior Racket',
        description: 'Shorter grip, for ages 7–11.',
        price: 20.0, stock: 5,
        categoryId: cats.find(c => c.name === 'Tennis Rackets').id,
        imageName: 'Head Junior Racket.jpg'
      },

      {
        name: 'Manual Scooter',
        description: 'Folding aluminum frame, 8" wheels.',
        price: 15.0, stock: 12,
        categoryId: cats.find(c => c.name === 'Scooters').id,
        imageName: 'Manual Scooter.jpg'
      },
      {
        name: 'Electric Scooter',
        description: 'Range: 25 km, speed up to 20 km/h.',
        price: 25.0, stock: 4,
        categoryId: cats.find(c => c.name === 'Scooters').id,
        imageName: 'Electric Scooter.jpg'
      },
      {
        name: 'Off-road Scooter',
        description: 'Chunky tires, mountain trails ready.',
        price: 28.0, stock: 3,
        categoryId: cats.find(c => c.name === 'Scooters').id,
        imageName: 'Off-road Scooter.jpg'
      },

      {
        name: '2-Person Tent',
        description: 'Waterproof, quick setup.',
        price: 18.0, stock: 6,
        categoryId: cats.find(c => c.name === 'Camping Gear').id,
        imageName: '2-Person Tent.jpg'
      },
      {
        name: 'Sleeping Bag – -10°C',
        description: 'Warm and compact.',
        price: 12.0, stock: 10,
        categoryId: cats.find(c => c.name === 'Camping Gear').id,
        imageName: 'Sleeping Bag – -10°C.jpg'
      },
      {
        name: 'Camping Stove',
        description: 'Portable gas burner.',
        price: 8.0, stock: 7,
        categoryId: cats.find(c => c.name === 'Camping Gear').id,
        imageName: 'Camping Stove.jpg'
      },

      {
        name: 'Inflatable Kayak',
        description: '2-person, includes paddles.',
        price: 45.0, stock: 2,
        categoryId: cats.find(c => c.name === 'Water Sports').id,
        imageName: 'Inflatable Kayak.jpg'
      },
      {
        name: 'SUP Paddle Board',
        description: 'Inflatable, includes leash & pump.',
        price: 40.0, stock: 5,
        categoryId: cats.find(c => c.name === 'Water Sports').id,
        imageName: 'SUP Paddle Board.jpg'
      },
      {
        name: 'Wetsuit – Adult M',
        description: '5mm neoprene, warm and flexible.',
        price: 20.0, stock: 6,
        categoryId: cats.find(c => c.name === 'Water Sports').id,
        imageName: 'Wetsuit – Adult M.jpg'
      },

      {
        name: 'Ski Helmet',
        description: 'Size M, certified protection.',
        price: 10.0, stock: 10,
        categoryId: cats.find(c => c.name === 'Winter Accessories').id,
        imageName: 'Ski Helmet.jpg'
      },
      {
        name: 'Ski Poles',
        description: 'Aluminum, adjustable height.',
        price: 5.0, stock: 12,
        categoryId: cats.find(c => c.name === 'Winter Accessories').id,
        imageName: 'Ski Poles.jpg'
      },
      {
        name: 'Thermal Gloves',
        description: 'Waterproof, breathable.',
        price: 6.0, stock: 8,
        categoryId: cats.find(c => c.name === 'Winter Accessories').id,
        imageName: 'Thermal Gloves.jpg'
      }
    ];

    await Product.bulkCreate(productsData, { ignoreDuplicates: true });

    const adminEmail = 'admin@gmail.com';
    const adminPass  = 'admin';
    const hash       = await bcrypt.hash(adminPass, 10);

    await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        name: 'Administrator',
        password: hash,
        role: 'admin'
      }
    });

    console.log('👌 Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('‼ Database seeding failed:', err);
    process.exit(1);
  }
}

seed();

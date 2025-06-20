require('dotenv').config();
const sequelize = require('./config/db');
const Category = require('./models/Category');
const Product  = require('./models/Product');

async function seed() {
    try {
        await sequelize.sync({ alter: true });

        const categoriesData = [
            { name: 'Rowery', description: 'Rower górski, szosowy i miejski' },
            { name: 'Narty',  description: 'Narty zjazdowe i biegowe' },
            { name: 'Rakiety tenisowe', description: 'Sprzęt tenisowy dla każdego poziomu' },
            { name: 'Hulajnogi', description: 'Hulajnogi manualne i elektryczne' }
        ];
        await Category.bulkCreate(categoriesData, { ignoreDuplicates: true });

        const cats = await Category.findAll();

        const productsData = [
            // ROWERY
            {
                name: 'Rower górski MTB 29"',
                description: 'Lekka aluminiowa rama, 21 biegów.',
                price: 50.00, stock: 5,
                categoryId: cats.find(c => c.name === 'Rowery').id
            },
            {
                name: 'Rower szosowy Ultra',
                description: 'Rama karbonowa, 18 biegów.',
                price: 60.00, stock: 3,
                categoryId: cats.find(c => c.name === 'Rowery').id
            },

            // NARTY
            {
                name: 'Narty zjazdowe Head Supershape',
                description: 'Długość 170 cm, wiązania Marker.',
                price: 40.00, stock: 8,
                categoryId: cats.find(c => c.name === 'Narty').id
            },
            {
                name: 'Narty biegowe Fischer',
                description: 'Lekkie narty klasyczne, długość 200 cm.',
                price: 35.00, stock: 6,
                categoryId: cats.find(c => c.name === 'Narty').id
            },

            // RAKIETY TENISOWE
            {
                name: 'Rakieta Wilson Pro Staff',
                description: 'Waga 310g, balans 31 cm.',
                price: 30.00, stock: 10,
                categoryId: cats.find(c => c.name === 'Rakiety tenisowe').id
            },
            {
                name: 'Rakieta Babolat Pure Drive',
                description: 'Doskonała moc i kontrola.',
                price: 32.00, stock: 7,
                categoryId: cats.find(c => c.name === 'Rakiety tenisowe').id
            },

            // HULAJNOGI
            {
                name: 'Hulajnoga manualna',
                description: 'Składana, aluminiowa, koła 8".',
                price: 15.00, stock: 12,
                categoryId: cats.find(c => c.name === 'Hulajnogi').id
            },
            {
                name: 'Hulajnoga elektryczna',
                description: 'Zasięg 25 km, prędkość do 20 km/h.',
                price: 25.00, stock: 4,
                categoryId: cats.find(c => c.name === 'Hulajnogi').id
            }
        ];

        await Product.bulkCreate(productsData, { ignoreDuplicates: true });

        console.log('👌 Seed zakończony pomyślnie');
        process.exit(0);
    } catch (err) {
        console.error('‼ Seed bazy nie powiódł się:', err);
        process.exit(1);
    }
}

seed();

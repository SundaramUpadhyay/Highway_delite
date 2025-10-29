import { query, initDB } from './db.js';

const experiences = [
  {
    name: 'Kayaking',
    location: 'Udupi',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
    price: 999,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop'
  },
  {
    name: 'Kayaking',
    location: 'Udupi, Karnataka',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
    price: 999,
    image_url: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop'
  },
  {
    name: 'Kayaking',
    location: 'Udupi, Karnataka',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image_url: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&auto=format&fit=crop'
  },
  {
    name: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop'
  },
  {
    name: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    image_url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop'
  },
  {
    name: 'Nandi Hills Sunrise',
    location: 'Bangalore',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 899,
    image_url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop'
  },
  {
    name: 'Boat Cruise',
    location: 'Sunderban',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop'
  },
  {
    name: 'Bunjee Jumping',
    location: 'Manali',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 999,
    image_url: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&auto=format&fit=crop'
  },
  {
    name: 'Coffee Trail',
    location: 'Coorg',
    description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
    price: 1299,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop'
  }
];

const seedData = async () => {
  try {
    console.log('Initializing database...');
    await initDB();

    console.log('Seeding experiences...');
    for (const exp of experiences) {
      const result = await query(
        `INSERT INTO experiences (name, location, description, price, image_url) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT DO NOTHING 
         RETURNING id`,
        [exp.name, exp.location, exp.description, exp.price, exp.image_url]
      );

      if (result.rows.length > 0) {
        const experienceId = result.rows[0].id;
        
        // Create slots for the next 5 days
        const times = [
          { time: '07:00 am', spots: 4 },
          { time: '09:00 am', spots: 2 },
          { time: '11:00 am', spots: 5 },
          { time: '01:00 pm', spots: 0 }
        ];

        for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
          const date = new Date();
          date.setDate(date.getDate() + dayOffset);
          const dateStr = date.toISOString().split('T')[0];

          for (const slot of times) {
            await query(
              `INSERT INTO slots (experience_id, date, time, available_spots, total_spots) 
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (experience_id, date, time) DO NOTHING`,
              [experienceId, dateStr, slot.time, slot.spots, slot.spots + 2]
            );
          }
        }
      }
    }

    console.log('Seeding promo codes...');
    await query(
      `INSERT INTO promo_codes (code, discount_type, discount_value) 
       VALUES 
       ('SAVE10', 'percentage', 10),
       ('FLAT100', 'fixed', 100),
       ('WELCOME20', 'percentage', 20)
       ON CONFLICT (code) DO NOTHING`
    );

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();

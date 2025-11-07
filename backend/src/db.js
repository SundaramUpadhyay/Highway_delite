import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);

export const initDB = async () => {
  try {
    // Create experiences table
    await query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create slots table
    await query(`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        experience_id INTEGER REFERENCES experiences(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        time VARCHAR(20) NOT NULL,
        available_spots INTEGER NOT NULL,
        total_spots INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(experience_id, date, time)
      )
    `);

    // Create bookings table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        reference_id VARCHAR(50) UNIQUE NOT NULL,
        experience_id INTEGER REFERENCES experiences(id),
        slot_id INTEGER REFERENCES slots(id),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(20) NOT NULL,
        subtotal INTEGER NOT NULL,
        taxes INTEGER NOT NULL,
        total INTEGER NOT NULL,
        promo_code VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create promo_codes table
    await query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;

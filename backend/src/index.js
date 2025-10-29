import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, initDB } from './db.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDB().catch(console.error);

// Routes

// GET /experiences - Return list of experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const { search } = req.query;
    let queryText = 'SELECT * FROM experiences ORDER BY id';
    let params = [];

    if (search) {
      queryText = 'SELECT * FROM experiences WHERE name ILIKE $1 OR location ILIKE $1 ORDER BY id';
      params = [`%${search}%`];
    }

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// GET /experiences/:id - Return details and slot availability
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get experience details
    const expResult = await query('SELECT * FROM experiences WHERE id = $1', [id]);
    
    if (expResult.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Get available slots
    const slotsResult = await query(
      `SELECT * FROM slots 
       WHERE experience_id = $1 
       AND date >= CURRENT_DATE 
       ORDER BY date, time`,
      [id]
    );

    const experience = expResult.rows[0];
    const slots = slotsResult.rows;

    // Group slots by date
    const slotsByDate = slots.reduce((acc, slot) => {
      const dateStr = slot.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push({
        id: slot.id,
        time: slot.time,
        available_spots: slot.available_spots,
        total_spots: slot.total_spots,
        is_sold_out: slot.available_spots === 0
      });
      return acc;
    }, {});

    res.json({
      ...experience,
      slots: slotsByDate
    });
  } catch (error) {
    console.error('Error fetching experience details:', error);
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
});

// POST /bookings - Accept booking details and store them
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      experienceId,
      slotId,
      fullName,
      email,
      quantity,
      date,
      time,
      subtotal,
      taxes,
      total,
      promoCode
    } = req.body;

    // Validate required fields
    if (!experienceId || !slotId || !fullName || !email || !quantity || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check slot availability
    const slotResult = await query('SELECT * FROM slots WHERE id = $1', [slotId]);
    
    if (slotResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }

    const slot = slotResult.rows[0];

    if (slot.available_spots < quantity) {
      return res.status(400).json({ error: 'Not enough spots available' });
    }

    // Generate reference ID
    const referenceId = uuidv4().substring(0, 8).toUpperCase();

    // Create booking
    const bookingResult = await query(
      `INSERT INTO bookings 
       (reference_id, experience_id, slot_id, full_name, email, quantity, date, time, subtotal, taxes, total, promo_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [referenceId, experienceId, slotId, fullName, email, quantity, date, time, subtotal, taxes, total, promoCode || null]
    );

    // Update slot availability
    await query(
      'UPDATE slots SET available_spots = available_spots - $1 WHERE id = $2',
      [quantity, slotId]
    );

    res.status(201).json({
      success: true,
      booking: bookingResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// POST /promo/validate - Validate promo codes
app.post('/api/promo/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Promo code is required' });
    }

    const result = await query(
      'SELECT * FROM promo_codes WHERE code = $1 AND is_active = true',
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    const promo = result.rows[0];
    let discount = 0;

    if (promo.discount_type === 'percentage') {
      discount = Math.round((subtotal * promo.discount_value) / 100);
    } else if (promo.discount_type === 'fixed') {
      discount = promo.discount_value;
    }

    res.json({
      valid: true,
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      discount: discount
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({ error: 'Failed to validate promo code' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

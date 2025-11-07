import { query } from './db.js';

const cleanupOldSlots = async () => {
  try {
    // Delete all existing bookings first
    await query('DELETE FROM bookings');
    console.log('All bookings deleted');
    
    // Delete all existing slots
    await query('DELETE FROM slots');
    console.log('All slots deleted');
    
    // Get all experiences
    const experiences = await query('SELECT id FROM experiences');
    console.log(`Found ${experiences.rows.length} experiences`);
    
    // Create new slots for the next 5 days
    const times = [
      { time: '07:00 am', spots: 4 },
      { time: '09:00 am', spots: 2 },
      { time: '11:00 am', spots: 5 },
      { time: '01:00 pm', spots: 0 }
    ];

    for (const exp of experiences.rows) {
      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0];

        for (const slot of times) {
          await query(
            `INSERT INTO slots (experience_id, date, time, available_spots, total_spots) 
             VALUES ($1, $2, $3, $4, $5)`,
            [exp.id, dateStr, slot.time, slot.spots, slot.spots + 2]
          );
        }
      }
    }
    
    console.log('New slots created for all experiences!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanupOldSlots();

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experiencesAPI, ExperienceDetail, Slot } from '../api';

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const data = await experiencesAPI.getById(Number(id));
        setExperience(data);
        
        // Auto-select first available date
        const dates = Object.keys(data.slots);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
        }
      } catch (err) {
        setError('Failed to load experience details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExperience();
    }
  }, [id]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: Slot) => {
    if (!slot.is_sold_out) {
      setSelectedSlot(slot);
    }
  };

  const handleConfirm = () => {
    if (!experience || !selectedSlot || !selectedDate) return;

    const subtotal = experience.price * quantity;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;

    navigate('/checkout', {
      state: {
        experience: {
          id: experience.id,
          name: experience.name,
        },
        slot: {
          id: selectedSlot.id,
          date: selectedDate,
          time: selectedSlot.time,
        },
        quantity,
        subtotal,
        taxes,
        total,
      },
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error || 'Experience not found'}</p>
      </div>
    );
  }

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;
  const availableSlots = selectedDate ? experience.slots[selectedDate] : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Experience Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden">
            <img
              src={experience.image_url}
              alt={experience.name}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* Title and Description */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {experience.name}
            </h1>
            <p className="text-gray-600">{experience.description}</p>
          </div>

          {/* Choose Date */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Choose date</h2>
            <div className="flex flex-wrap gap-2">
              {Object.keys(experience.slots).map((date) => (
                <button
                  key={date}
                  onClick={() => handleDateSelect(date)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedDate === date
                      ? 'bg-primary text-black border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {formatDate(date)}
                </button>
              ))}
            </div>
          </div>

          {/* Choose Time */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Choose time</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={slot.is_sold_out}
                  className={`p-3 rounded-lg border transition-colors ${
                    slot.is_sold_out
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : selectedSlot?.id === slot.id
                      ? 'bg-primary text-black border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium">{slot.time}</div>
                  <div className="text-xs mt-1">
                    {slot.is_sold_out ? (
                      <span className="text-red-500">Sold out</span>
                    ) : (
                      <span className="text-gray-500">{slot.available_spots} left</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
            
            {/* Price */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">Starts at</span>
              <div className="text-2xl font-bold">₹{experience.price}</div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">₹{taxes}</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">₹{total}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedSlot
                  ? 'bg-primary hover:bg-primary-dark text-black'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Details;

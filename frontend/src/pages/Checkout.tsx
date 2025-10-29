import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingsAPI, promoAPI } from '../api';

interface CheckoutState {
  experience: {
    id: number;
    name: string;
  };
  slot: {
    id: number;
    date: string;
    time: string;
  };
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!state) {
    navigate('/');
    return null;
  }

  const handleApplyPromo = async () => {
    try {
      setPromoError('');
      const result = await promoAPI.validate({
        code: promoCode,
        subtotal: state.subtotal,
      });
      setDiscount(result.discount);
      setPromoApplied(true);
    } catch (err: any) {
      setPromoError(err.response?.data?.error || 'Invalid promo code');
    }
  };

  const finalTotal = state.total - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError('Please agree to the terms and safety policy');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const bookingData = {
        experienceId: state.experience.id,
        slotId: state.slot.id,
        fullName,
        email,
        quantity: state.quantity,
        date: state.slot.date,
        time: state.slot.time,
        subtotal: state.subtotal,
        taxes: state.taxes,
        total: finalTotal,
        promoCode: promoApplied ? promoCode : undefined,
      };

      const result = await bookingsAPI.create(bookingData);

      navigate('/result', {
        state: {
          success: true,
          referenceId: result.booking.reference_id,
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Checkout
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-100 rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoApplied(false);
                      setDiscount(0);
                      setPromoError('');
                    }}
                    placeholder="Promo code"
                    disabled={promoApplied}
                    className="flex-1 px-4 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode || promoApplied}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-600 text-sm mt-1">{promoError}</p>}
                {promoApplied && <p className="text-green-600 text-sm mt-1">Promo code applied!</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  I agree to the terms and safety policy
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{state.experience.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{formatDate(state.slot.date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">{state.slot.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Qty</span>
                <span className="font-medium">{state.quantity}</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{state.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">₹{state.taxes}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !agreeTerms}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                loading || !agreeTerms
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-black'
              }`}
            >
              {loading ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;

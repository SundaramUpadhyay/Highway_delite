import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ResultState {
  success: boolean;
  referenceId?: string;
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {state.success ? (
          <>
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Booking Confirmed
            </h1>
            
            {state.referenceId && (
              <p className="text-gray-600 mb-8">
                Ref ID: {state.referenceId}
              </p>
            )}

            {/* Back to Home Button */}
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Home
            </button>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Booking Failed
            </h1>
            
            <p className="text-gray-600 mb-8">
              Sorry, we couldn't complete your booking. Please try again.
            </p>

            {/* Retry Button */}
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Result;

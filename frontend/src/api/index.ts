import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface Experience {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
  image_url: string;
  created_at?: string;
}

export interface Slot {
  id: number;
  time: string;
  available_spots: number;
  total_spots: number;
  is_sold_out: boolean;
}

export interface ExperienceDetail extends Experience {
  slots: {
    [date: string]: Slot[];
  };
}

export interface BookingRequest {
  experienceId: number;
  slotId: number;
  fullName: string;
  email: string;
  quantity: number;
  date: string;
  time: string;
  subtotal: number;
  taxes: number;
  total: number;
  promoCode?: string;
}

export interface BookingResponse {
  success: boolean;
  booking: {
    id: number;
    reference_id: string;
    experience_id: number;
    slot_id: number;
    full_name: string;
    email: string;
    quantity: number;
    date: string;
    time: string;
    subtotal: number;
    taxes: number;
    total: number;
    promo_code: string | null;
    created_at: string;
  };
}

export interface PromoCodeRequest {
  code: string;
  subtotal: number;
}

export interface PromoCodeResponse {
  valid: boolean;
  code: string;
  discount_type: string;
  discount_value: number;
  discount: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const experiencesAPI = {
  getAll: async (search?: string): Promise<Experience[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/experiences', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ExperienceDetail> => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  },
};

export const bookingsAPI = {
  create: async (bookingData: BookingRequest): Promise<BookingResponse> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },
};

export const promoAPI = {
  validate: async (promoData: PromoCodeRequest): Promise<PromoCodeResponse> => {
    const response = await api.post('/promo/validate', promoData);
    return response.data;
  },
};

export default api;

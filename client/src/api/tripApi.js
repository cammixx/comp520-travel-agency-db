import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

export async function fetchTrips() {
  try {
    const response = await axios.get(`${API_URL}/trips`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export async function fetchTopBookedTrips() {
  try {
    const response = await axios.get(`${API_URL}/trips/top-booked`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top booked trips:', error);
    return [];
  }
}

export async function fetchTripList() {
  try {
    const res = await axios.get(`${API_URL}/trips`);
    return res.data;
  } catch (err) {
    console.error('Error fetching trips:', err);
    return [];
  }
}

export async function fetchFlightList() {
  try {
    const res = await axios.get(`${API_URL}/flights`);
    return res.data.map(flight => ({
      ...flight,
      flight_id: Number(flight.flight_id) || 0,
      price: Number(flight.price) || 0
    }));
  } catch (err) {
    console.error('Error fetching flights:', err);
    return [];
  }
}

export async function fetchHotelList() {
  try {
    const res = await axios.get(`${API_URL}/hotels`);
    return res.data;
  } catch (err) {
    console.error('Error fetching hotels:', err);
    return [];
  }
}
export async function fetchInsuranceOptions() {
  try {
    const res = await axios.get(`${API_URL}/insurance-options`);
    return res.data;
  } catch (err) {
    console.error('Error fetching insurance options:', err);
    return [];
  }
}

export async function createBooking(data) {
  try {
    const response = await axios.post(`${API_URL}/bookings`, {
      tripId: data.tripId,
      startDate: data.startDate,
      endDate: data.endDate,
      insuranceId: data.insuranceId || null,
      departureFlightId: data.departureFlightId || null,
      returnFlightId: data.returnFlightId || null,
      hotelId: data.hotelId || null,
      total_price: data.total_price || 0,
      customer: data.customer
    });
    return response.data;
  } catch (error) {
    console.error('Booking failed:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export async function fetchBookingByConfirmation(code) {
  try {
    const res = await axios.get(`${API_URL}/bookings/by-code/${code}`);
    return res.data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return { success: false, error: err.response?.data?.message || 'Unknown error' };
  }
}

export async function cancelBookingByCode(code) {
  try {
    const res = await axios.post(`${API_URL}/bookings/cancel`, { confirmationCode: code });
    return res.data;
  } catch (err) {
    console.error('Cancel failed:', err);
    return { success: false, error: err.response?.data?.message || 'Cancel error' };
  }
}

export async function fetchAffordableTrips(budget) {
  try {
    const res = await axios.get(`${API_URL}/trips/affordable/${budget}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching affordable trips:', err);
    return [];
  }
}

export async function fetchTopRatedTrips(minRating) {
  try {
    const res = await fetch(`${API_URL}/trips/top-rated/${minRating}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching top rated trips:', err);
    return [];
  }
}
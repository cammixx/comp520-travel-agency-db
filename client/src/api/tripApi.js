import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

// 1. Fetch all trips
export async function fetchTrips() {
  try {
    const response = await axios.get(`${API_URL}/trips`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}
// 2. Fetch top booked trips
export async function fetchTopBookedTrips() {
  try {
    const response = await axios.get(`${API_URL}/trips/top-booked`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top booked trips:', error);
    return [];
  }
}
// 3. Fetch trip list
export async function fetchTripList() {
  try {
    const res = await axios.get(`${API_URL}/trips`);
    return res.data;
  } catch (err) {
    console.error('Error fetching trips:', err);
    return [];
  }
}
// 4. Fetch flight list
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
// 5. Fetch hotel list
export async function fetchHotelList() {
  try {
    const res = await axios.get(`${API_URL}/hotels`);
    return res.data;
  } catch (err) {
    console.error('Error fetching hotels:', err);
    return [];
  }
}
// 6. Fetch insurance options
export async function fetchInsuranceOptions() {
  try {
    const res = await axios.get(`${API_URL}/insurance-options`);
    return res.data;
  } catch (err) {
    console.error('Error fetching insurance options:', err);
    return [];
  }
}
// 7. Create booking
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
    throw error;
  }
}
// 8. Fetch booking by confirmation code
export async function fetchBookingByConfirmation(code) {
  try {
    const res = await axios.get(`${API_URL}/bookings/by-code/${code}`);
    return res.data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return { success: false, error: err.response?.data?.message || 'Unknown error' };
  }
}
// 9. Cancel booking by confirmation code
export async function cancelBookingByCode(code) {
  try {
    const res = await axios.post(`${API_URL}/bookings/cancel`, { confirmationCode: code });
    return res.data;
  } catch (err) {
    console.error('Cancel failed:', err);
    return { success: false, error: err.response?.data?.message || 'Cancel error' };
  }
}
// 10. Fetch affordable trips
export async function fetchAffordableTrips(budget) {
  try {
    const res = await axios.get(`${API_URL}/trips/affordable/${budget}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching affordable trips:', err);
    return [];
  }
}
// 11. Fetch top rated trips  
export async function fetchTopRatedTrips(minRating) {
  try {
    const res = await fetch(`${API_URL}/trips/top-rated/${minRating}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching top rated trips:', err);
    return [];
  }
}
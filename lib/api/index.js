import axios from 'axios';
import { catchErrors } from '../utils';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchEvents(page = 1, filters = {}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters,
    });

    const { data } = await api.get(`/events?${params}`);
    return data;
  } catch (error) {
    throw catchErrors(error);
  }
}

export async function createEvent(eventData) {
  try {
    const { data } = await api.post('/events', eventData);
    return data;
  } catch (error) {
    throw catchErrors(error);
  }
}

export async function createReservation(reservationData) {
  try {
    const { data } = await api.post('/reservations', reservationData);
    return data;
  } catch (error) {
    throw catchErrors(error);
  }
}

export async function fetchUserReservations() {
  try {
    const { data } = await api.get('/reservations');
    return data;
  } catch (error) {
    throw catchErrors(error);
  }
} 
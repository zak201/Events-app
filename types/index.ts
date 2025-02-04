export interface Event {
  _id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface Reservation {
  _id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  seats: number;
  createdAt: Date;
} 
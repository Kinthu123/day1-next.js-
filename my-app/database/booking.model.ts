import mongoose, { Schema, Document, Model } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

// Pre-save hook for validation
BookingSchema.pre('save', async function (this: IBooking) {
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    throw new Error('Invalid email format');
  }

  // Check if event exists
  const event = await Event.findById(this.eventId);
  if (!event) {
    throw new Error('Event not found');
  }
});

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

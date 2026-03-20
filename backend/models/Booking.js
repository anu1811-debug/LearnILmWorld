import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({

  // Store student reference for paid bookings
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Store trainer reference for both paid and free demo bookings
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Store student name for free demo bookings
  studentName: {
    type: String,
    required: true
  },

  // Optional email for free demo bookings
  studentEmail:{
    type: String, 
    required: false, 
    trim: true, 
    lowercase: true
  },

  // Type of booking: paid or free demo
  bookingType: {
    type: String,
    enum: ['private', 'group', 'free_demo'],
    default: 'private', 
    required: true
  },
  date: { type: String }, 
time: { type: String },
duration: { type: Number},
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Payment details
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'na'],//na for free demo
    default: 'pending'
  },

  // For paid bookings
  paymentMethod: {
    type: String,
    enum: ['stripe', 'fake', 'none', 'razorpay'], //none for free demo
    required: true
  },
  
  // Store amount only for paid bookings
  amount: {
    type: Number,
    required: function(){ return this.bookingType==='paid'} // required only if booking is paid
  },

  // Store Stripe payment details
  paymentId: String,
  paymentDetails: {
    amount: Number,
    currency: String,
    paymentMethod: String,
    status: String,
    receiptUrl: String,
    processedAt: Date
  },

  // Reference to the session being booked
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  notes: String
}, {
  timestamps: true
});

bookingSchema.index({ studentEmail: 1, bookingType: 1 });
export default mongoose.model('Booking', bookingSchema);
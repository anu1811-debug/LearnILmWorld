import mongoose from 'mongoose';

const ClassScheduleSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for group sessions
  title: { type: String },
  price: { type: Number }, 
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  maxParticipants: { type: Number, default: 5 },
  type: { type: String, enum: ['private', 'group'], required: true },
  startTime: { type: Date, required: true, index: true }, 
  endTime: { type: Date, required: true },
  durationMinutes: { type: Number, enum: [30, 60, 90], required: true },
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' }
});

// Prevent overlapping classSchedule at the database level
ClassScheduleSchema.index({ teacherId: 1, startTime: 1, endTime: 1 });

const ClassSchedule = mongoose.model('ClassSchedule', ClassScheduleSchema);
export default ClassSchedule;
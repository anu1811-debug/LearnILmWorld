import User from '../models/User.js';
import ClassSchedule from '../models/ClassSchedule.js';
import mongoose from 'mongoose';
import moment from 'moment-timezone'


export const getAvailableSlots = async (req, res) => {
  try {
    const { teacherId, dateStr, durationMinutes } = req.query;
    const duration = parseInt(durationMinutes, 10);

    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    // Teacher ka timezone nikalo (default India rakh diya hai fallback ke liye)
    const teacherTz = teacher.profile?.timezone || 'Asia/Kolkata';

    // Student ki date ko teacher ke timezone me parse karo
    const targetDateInTeacherTz = moment.tz(dateStr, "YYYY-MM-DD", teacherTz);
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[targetDateInTeacherTz.day()];

    const dayAvailability = teacher.profile.availability.find(a => a.day === dayOfWeek);

    if (!dayAvailability || !dayAvailability.available || !dayAvailability.startTime || !dayAvailability.endTime) {
      return res.status(200).json({ slots: [] }); 
    }

    // Teacher ke shift times ko UTC me convert karo
    const workStartMoment = moment.tz(`${dateStr} ${dayAvailability.startTime}`, "YYYY-MM-DD HH:mm", teacherTz);
    const workEndMoment = moment.tz(`${dateStr} ${dayAvailability.endTime}`, "YYYY-MM-DD HH:mm", teacherTz);

    const workStartTime = workStartMoment.toDate(); 
    const workEndTime = workEndMoment.toDate();

    const existingAppointments = await ClassSchedule.find({
      teacherId,
      startTime: { $gte: workStartMoment.startOf('day').toDate(), $lte: workStartMoment.endOf('day').toDate() },
      status: { $ne: 'cancelled' }
    }).sort({ startTime: 1 });

    const blockedIntervals = existingAppointments.map(appt => {
      const bufferedEndTime = new Date(appt.endTime);
      bufferedEndTime.setMinutes(bufferedEndTime.getMinutes() + 30);  //break time
      return {
        start: new Date(appt.startTime).getTime(),
        end: bufferedEndTime.getTime()
      };
    });

    const availableSlots = [];
    let currentSlotStart = new Date(workStartTime);
    const currentTime = new Date().getTime(); 

    while (true) {
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + duration);

      if (currentSlotEnd.getTime() > workEndTime.getTime()) {
        break;
      }

      const slotStartTime = currentSlotStart.getTime();
      const slotEndTime = currentSlotEnd.getTime();

      // Only show future slots
      if (slotStartTime > currentTime) {
        const hasConflict = blockedIntervals.some(interval => {
          return (slotStartTime < interval.end && slotEndTime > interval.start);
        });

        if (!hasConflict) {
          // Send exact UTC ISO string to frontend 
          availableSlots.push(currentSlotStart.toISOString());
        }
      }
      currentSlotStart.setMinutes(currentSlotStart.getMinutes() + 30);
    }

    return res.status(200).json({ slots: availableSlots });

  } catch (error) {
    console.error('Error in slot generation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//Creating group class
export const createGroupClass = async (req, res) => {
  try {
    const { teacherId, title, startTime, durationMinutes, price } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const teacherTz = teacher.profile?.timezone || 'Asia/Kolkata';

    // Teacher ke form input ko uske timezone ke hisaab se UTC me convert karo
    const startMoment = moment.tz(startTime, teacherTz);
    const start = startMoment.toDate();
    
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + parseInt(durationMinutes, 10));

    // Availability Check based on Teacher's timezone
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[startMoment.day()];
    const dateStr = startMoment.format("YYYY-MM-DD");

    const dayAvailability = teacher.profile.availability.find(a => a.day === dayOfWeek);

    if (!dayAvailability || !dayAvailability.available || !dayAvailability.startTime || !dayAvailability.endTime) {
      return res.status(400).json({ message: `You are not available on ${dayOfWeek}s.` });
    }

    const workStartTime = moment.tz(`${dateStr} ${dayAvailability.startTime}`, "YYYY-MM-DD HH:mm", teacherTz).toDate();
    const workEndTime = moment.tz(`${dateStr} ${dayAvailability.endTime}`, "YYYY-MM-DD HH:mm", teacherTz).toDate();

    if (start.getTime() < workStartTime.getTime() || end.getTime() > workEndTime.getTime()) {
      return res.status(400).json({ 
        message: `Class timing is outside your working hours (${dayAvailability.startTime} - ${dayAvailability.endTime}).` 
      });
    }

    // Conflict Check
    const bufferedStart = new Date(start);
    bufferedStart.setMinutes(bufferedStart.getMinutes() - 30);
    
    const bufferedEnd = new Date(end);
    bufferedEnd.setMinutes(bufferedEnd.getMinutes() + 30);

    const conflict = await ClassSchedule.findOne({
      teacherId,
      status: { $ne: 'cancelled' },
      $or: [
        { startTime: { $lt: bufferedEnd }, endTime: { $gt: bufferedStart } }
      ]
    });

    if (conflict) {
      return res.status(400).json({ message: 'You have another class or mandatory break at this time.' });
    }

    // Database always saves the absolute UTC time
    const newGroupClass = await ClassSchedule.create({
      teacherId,
      title,
      price,
      type: 'group',
      startTime: start,
      endTime: end,
      durationMinutes,
      maxParticipants: 4, 
      enrolledStudents: [] 
    });

    return res.status(201).json({ message: 'Group class created successfully!', groupClass: newGroupClass });

  } catch (error) {
    console.error('Error creating group class:', error);
    return res.status(500).json({ message: 'Server error creating class.' });
  }
};


// Fetch upcoming group classes for a specific teacher
export const getGroupClasses = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Invalid teacher ID format.' });
    }

    const currentTime = new Date();
    const groupClasses = await ClassSchedule.find({
      teacherId,
      type: 'group',
      startTime: { $gt: currentTime }, 
      status: 'scheduled'
    }).sort({ startTime: 1 }).populate('teacherId', 'name profile.experience stats.rating');
    
    return res.status(200).json({ classes: groupClasses });
    
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error in your server.', 
      errorDetail: error.message 
    });
  }
};
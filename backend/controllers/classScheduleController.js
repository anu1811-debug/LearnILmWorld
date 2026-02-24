import User from '../models/User.js';
import ClassSchedule from '../models/ClassSchedule.js';
import mongoose from 'mongoose';

// Helper function to convert "HH:mm" to a precise Date object
const parseTime = (baseDate, timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(baseDate);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { teacherId, dateStr, durationMinutes } = req.query;
    
    const targetDate = new Date(dateStr);
    const duration = parseInt(durationMinutes, 10); 
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[targetDate.getDay()];

    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const dayAvailability = teacher.profile.availability.find(a => a.day === dayOfWeek);

    if (!dayAvailability || !dayAvailability.available || !dayAvailability.startTime || !dayAvailability.endTime) {
      return res.status(200).json({ slots: [] }); // No availability for this day
    }

    const workStartTime = parseTime(targetDate, dayAvailability.startTime);
    const workEndTime = parseTime(targetDate, dayAvailability.endTime);

    const startOfDay = new Date(targetDate).setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate).setHours(23, 59, 59, 999);

    const existingAppointments = await ClassSchedule.find({
      teacherId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    }).sort({ startTime: 1 }); 

    // Map existing classSchedule to blocked intervals 
    const blockedIntervals = existingAppointments.map(appt => {
      const bufferedEndTime = new Date(appt.endTime);
      bufferedEndTime.setMinutes(bufferedEndTime.getMinutes() + 30); //break time
      
      return {
        start: new Date(appt.startTime).getTime(),
        end: bufferedEndTime.getTime()
      };
    });

    const availableSlots = [];
    let currentSlotStart = new Date(workStartTime);
    const currentTime= new Date().getTime()

    while (true) {
      const currentSlotEnd = new Date(currentSlotStart);
      currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + duration);

      // Terminate loop if the generated slot exceeds the teacher's shift
      if (currentSlotEnd.getTime() > workEndTime.getTime()) {
        break;
      }

      const slotStartTime = currentSlotStart.getTime();
      const slotEndTime = currentSlotEnd.getTime();

      // Check if current slot overlaps with any blocked interval
      if(slotStartTime>currentTime){

        const hasConflict = blockedIntervals.some(interval => {
          return (slotStartTime < interval.end && slotEndTime > interval.start);
        });
        
        if (!hasConflict) {
          const hours = currentSlotStart.getHours().toString().padStart(2, '0');
          const minutes = currentSlotStart.getMinutes().toString().padStart(2, '0');
          availableSlots.push(`${hours}:${minutes}`);
        }
      }

      currentSlotStart.setMinutes(currentSlotStart.getMinutes() + 30);
    }

    return res.status(200).json({ slots: availableSlots });

  } catch (error) {
    console.error('Error in slot generation algorithm:', error);
    return res.status(500).json({ message: 'Internal server error during slot calculation.' });
  }
};

//Creating group class
export const createGroupClass = async (req, res) => {
  try {
    const { teacherId, title, startTime, durationMinutes, price } = req.body;

    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + parseInt(durationMinutes, 10));

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[start.getDay()];

    const teacher = await User.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const dayAvailability = teacher.profile.availability.find(a => a.day === dayOfWeek);

    if (!dayAvailability || !dayAvailability.available || !dayAvailability.startTime || !dayAvailability.endTime) {
      return res.status(400).json({ message: `You are not available at ${dayOfWeek}.` });
    }

    const workStartTime = parseTime(start, dayAvailability.startTime);
    const workEndTime = parseTime(start, dayAvailability.endTime);

    if (start.getTime() < workStartTime.getTime() || end.getTime() > workEndTime.getTime()) {
      return res.status(400).json({ 
        message: `Class timing (${dayAvailability.startTime} - ${dayAvailability.endTime}) is not fit with your availablitiy time.` 
      });
    }
    // Verify the teacher doesn't already have a class scheduled at this time
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
      return res.status(400).json({ message: 'You have some other classes at this time or it is your break time.' });
    }

    const newGroupClass = await ClassSchedule.create({
      teacherId,
      title,
      price,
      type: 'group',
      startTime: start,
      endTime: end,
      durationMinutes,
      maxParticipants: 5, 
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
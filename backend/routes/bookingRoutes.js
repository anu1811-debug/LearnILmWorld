import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { accessFreeDemo } from '../controllers/bookingController.js';
import ClassSchedule from '../models/ClassSchedule.js';

const router = express.Router();

// Create booking
router.post("/", authenticate, async (req, res) => {
  try {
    const { trainerId, studentName, studentEmail, paymentMethod, amount, bookingType, date, time, duration, classId } = req.body;
    
    const booking = new Booking({
      student: req.user._id,
      trainer: trainerId,
      studentName,
      studentEmail,
      paymentMethod,
      amount,
      bookingType,
      date,        
      time,        
      duration
    }); 

    await booking.save();
    if (bookingType === 'group' && classId) {
      await ClassSchedule.findByIdAndUpdate(classId, {
        $push: { enrolledStudents: req.user._id } // Student enrolled in class
      });
    }
    await booking.populate(['student', 'trainer']);

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user bookings
router.get("/my-bookings", authenticate, async (req, res) => {
  try {
    let query;
    if (req.user.role === "student") {
      query = { student: req.user._id };
    } else {
      query = { trainer: req.user._id };
    }

    const bookings = await Booking.find(query)
      .populate("student", "name email")
      .populate("trainer", "name email profile")
      .populate("sessionId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings for trainer
router.get("/trainer-bookings", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "trainer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const bookings = await Booking.find({
      trainer: req.user._id,
      paymentStatus: "completed",
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.put("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate(["student", "trainer"]);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update payment status
router.put("/:id/payment", authenticate, async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
        paymentId,
        status: paymentStatus === "completed" ? "confirmed" : "pending",
      },
      { new: true },
    ).populate(["student", "trainer"]);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update trainer earnings if payment completed
    if (paymentStatus === "completed") {
      await User.findByIdAndUpdate(booking.trainer._id, {
        $inc: { "stats.totalEarnings": booking.amount },
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete booking
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (
      booking.student.toString() !== req.user._id.toString() &&
      booking.trainer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/free-demo-access", authenticate, accessFreeDemo);

export default router;

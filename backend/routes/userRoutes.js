import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import ClassSchedule from '../models/ClassSchedule.js'

const router = express.Router();

// Get all trainers
router.get('/trainers', async (req, res) => {
  try {
    const {
      language,
      specialization,
      hobby,
      minRate,
      maxRate,
      experience,
      rating,
      availability,
      search,
      nationality,
      sortBy,
      bookingType //for group and private in filter pannel
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    let query = { role: 'trainer', isActive: true };

    //booking type private or group
    if (bookingType) {
      if (bookingType === 'group') {
        // GROUP: Find all the teachernthat have a pre-created future group class
        const activeTeacherIds = await ClassSchedule.distinct('teacherId', {
          type: 'group',
          status: { $ne: 'cancelled' },
          startTime: { $gte: new Date() } 
        });
        
        query._id = { $in: activeTeacherIds };
        
      } else if (bookingType === 'private') {
        // PRIVATE: works on the available slots
        query['profile.availability'] = { 
          $elemMatch: { available: true } 
        };
      }
    }

    // Language filter (both arrays supported)
    if (language) {
      const regex = new RegExp(language, 'i');
      query.$or = [
        { 'profile.languages': { $in: [regex] } },
        { 'profile.trainerLanguages.language': regex }
      ];
    }

    // Specialization
    if (specialization) {
      query['profile.specializations'] = { $in: [new RegExp(specialization, 'i')] };
    }

    // Hobby filter
    if (hobby) {
      query['profile.hobbies'] = { $in: [new RegExp(hobby, 'i')] };
    }

    // Nationality
    if (nationality) {
      query['profile.nationalityCode'] = nationality;
    }

    // Price Filters
    if (minRate || maxRate) {
      query['profile.hourlyRate'] = {};
      if (minRate) query['profile.hourlyRate'].$gte = parseFloat(minRate);
      if (maxRate) query['profile.hourlyRate'].$lte = parseFloat(maxRate);
    }

    // Experience
    if (experience) {
      query['profile.experience'] = { $gte: parseInt(experience) };
    }

    // Rating
    if (rating) {
      query['stats.rating'] = { $gte: parseFloat(rating) };
    }

    // Availability
    if (availability === "true") {
      query['profile.isAvailable'] = true;
    }

    // Search (name, bio, langs, specialization, hobbies)
    if (search) {
      const reg = new RegExp(search, 'i');
      query.$or = [
        { name: reg },
        { 'profile.bio': reg },
        { 'profile.languages': { $in: [reg] } },
        { 'profile.specializations': { $in: [reg] } },
        { 'profile.hobbies': { $in: [reg] } },
      ];
    }

    let trainersQuery = User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit);

    // Sorting
    switch (sortBy) {
      case 'price_low':
        trainersQuery.sort({ 'profile.hourlyRate': 1 });
        break;
      case 'price_high':
        trainersQuery.sort({ 'profile.hourlyRate': -1 });
        break;
      case 'experience':
        trainersQuery.sort({ 'profile.experience': -1 });
        break;
      default:
        trainersQuery.sort({ 'stats.rating': -1 });
    }

    const trainers = await trainersQuery;
    const totalCount = await User.countDocuments(query);

    res.json({ trainers, page, totalCount, limit });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update user
router.put('/profile', authenticate, async (req, res) => {
  try {
    const updates = req.body;


    // forbidden fields
    delete updates.password;
    delete updates.email;
    delete updates.role;

    const existingUser = await User.findById(req.user._id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    // if (updates.hasOwnProperty('secondaryEmail')) {

    //   if (updates.secondaryEmail === '') {
    //     existingUser.secondaryEmail = undefined
    //     delete updates.secondaryEmail;
    //   }

    //   else {
    //     const emailInUse = await User.findOne({
    //       secondaryEmail: updates.secondaryEmail,
    //       _id: { $ne: existingUser._id }
    //     });
    //     if (emailInUse) {
    //       return res.status(400).json({ message: 'This secondary email is already in use' });
    //     }
    //     existingUser.secondaryEmail = updates.secondaryEmail; // update it safely
    //     delete updates.secondaryEmail; // remove from updates to avoid double-assign
    //   }
    // }

    // MERGE, DON'T REPLACE PROFILE
    if (updates.profile) {
      existingUser.profile = {
        ...existingUser.profile.toObject(),
        ...updates.profile
      };
      delete updates.profile;
    }

    // apply top-level updates
    Object.assign(existingUser, updates);

    const savedUser = await existingUser.save();
    const userToSend = savedUser.toObject();
    delete userToSend.password;
    // userToSend.secondaryEmail = savedUser.secondaryEmail || '';

    // console.log("SAFE UPDATED USER:", userToSend);

    res.json(userToSend);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('stats');
    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
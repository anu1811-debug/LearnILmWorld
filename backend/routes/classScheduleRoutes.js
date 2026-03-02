import express from 'express';
import { createGroupClass, getAvailableSlots, getGroupClasses } from '../controllers/classScheduleController.js';

const router = express.Router();

router.get('/slots', getAvailableSlots);
router.post('/group-session', createGroupClass);
router.get('/group-sessions/:teacherId', getGroupClasses);

export default router;
import express from 'express';
import { deleteFile, getDownloadUrl, getUploadUrl } from '../controllers/uploadController.js';

const router = express.Router();
router.post('/get-upload-url', getUploadUrl);
router.post('/get-download-url', getDownloadUrl);
router.post('/delete-file', deleteFile);
export default router;


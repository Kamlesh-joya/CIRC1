import express from 'express';
import { enquiryController } from '../controllers/enquiry.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Require login/signup before proceeding with a service enquiry
router.post('/prepare', requireAuth, enquiryController.prepareEnquiry);

export default router;

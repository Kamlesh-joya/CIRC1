import express from 'express';
import { catalogController } from '../controllers/catalog.controller.js';

const router = express.Router();

router.get('/categories', catalogController.getCategories);
router.get('/popular', catalogController.getPopularServices);
router.get('/', catalogController.getServices);
router.get('/:id', catalogController.getServiceById);

export default router;

import { Router } from 'express';
import { getCarById, listCars } from '../controllers/cars.controller.js';

const router = Router();

router.get('/', listCars);
router.get('/:id', getCarById);

export default router;

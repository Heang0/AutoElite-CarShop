import mongoose from 'mongoose';
import env from '../config/env.js';
import Car from '../models/Car.js';
import carsSeed from '../data/cars.seed.js';

async function seedCars() {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    await Car.deleteMany({});
    await Car.insertMany(carsSeed);

    console.log(`Seed complete: inserted ${carsSeed.length} cars`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seedCars();

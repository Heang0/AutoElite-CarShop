import mongoose from 'mongoose';

const specificationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const carSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true, min: 0 },
    mileage: { type: Number, required: true, min: 0 },
    fuelType: { type: String, required: true, trim: true },
    transmission: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 4 },
    image: { type: String, required: true, trim: true },
    features: [{ type: String, trim: true }],
    type: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true, default: '' },
    gallery: [{ type: String, trim: true }],
    specifications: [specificationSchema]
  },
  {
    timestamps: true
  }
);

const Car = mongoose.model('Car', carSchema);

export default Car;

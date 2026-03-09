import Car from '../models/Car.js';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function listCars(req, res, next) {
  try {
    const { search, brand, type, min_price: minPrice, max_price: maxPrice } = req.query;

    const query = {};

    if (search) {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: regex }, { brand: regex }, { model: regex }];
    }

    if (brand) {
      query.brand = new RegExp(`^${escapeRegex(brand.trim())}$`, 'i');
    }

    if (type) {
      query.type = new RegExp(`^${escapeRegex(type.trim())}$`, 'i');
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && Number.isFinite(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && Number.isFinite(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const cars = await Car.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: cars });
  } catch (error) {
    next(error);
  }
}

export async function getCarById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ success: false, message: 'Invalid car id' });
    }

    const car = await Car.findOne({ id }).lean();
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }

    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
}

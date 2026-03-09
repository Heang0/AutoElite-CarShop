const carsSeed = [
  {
    id: 1,
    name: 'BMW M5 Competition',
    brand: 'BMW',
    model: 'M5 Competition',
    year: 2023,
    price: 115900,
    mileage: 15000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
    features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound'],
    type: 'Sedan',
    description: 'Performance sedan with luxury interior and precise handling.',
    gallery: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 2,
    name: 'BMW X6 M Competition',
    brand: 'BMW',
    model: 'X6 M Competition',
    year: 2023,
    price: 108900,
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    rating: 4,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension'],
    type: 'SUV',
    description: 'Luxury SUV coupe with aggressive styling and premium comfort.',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 3,
    name: 'Mercedes-Benz GLE 450',
    brand: 'Mercedes-Benz',
    model: 'GLE 450',
    year: 2023,
    price: 63500,
    mileage: 12000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    rating: 4,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension'],
    type: 'SUV',
    description: 'Executive-class SUV with hybrid efficiency and a refined cabin.',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 4,
    name: 'Audi RS7 Sportback',
    brand: 'Audi',
    model: 'RS7 Sportback',
    year: 2023,
    price: 119900,
    mileage: 8500,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
    features: ['Quattro AWD', 'Virtual Cockpit', 'Matrix LED', 'Premium Audio'],
    type: 'Coupe',
    description: 'High-performance grand tourer blending speed and elegance.',
    gallery: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 5,
    name: 'Audi Q8',
    brand: 'Audi',
    model: 'Q8',
    year: 2023,
    price: 84700,
    mileage: 10000,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    rating: 4,
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    features: ['Virtual Cockpit', 'Matrix LED', 'Panoramic Sunroof', 'Leather Interior'],
    type: 'SUV',
    description: 'Premium SUV focused on comfort, technology, and road presence.',
    gallery: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 6,
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    price: 135990,
    mileage: 5000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    features: ['Autopilot', '17-inch Touchscreen', 'Premium Interior', 'Track Mode'],
    type: 'Sedan',
    description: 'Flagship EV sedan with extreme acceleration and modern tech.',
    gallery: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 7,
    name: 'Tesla Model 3',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 42990,
    mileage: 15000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    rating: 4,
    image:
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
    features: ['Autopilot', 'Premium Interior', 'OTA Updates', 'Fast Charging'],
    type: 'Sedan',
    description: 'Balanced electric sedan with strong range and technology value.',
    gallery: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 8,
    name: 'Toyota RAV4 Hybrid',
    brand: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2023,
    price: 28475,
    mileage: 18000,
    fuelType: 'Hybrid',
    transmission: 'CVT',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
    features: ['Toyota Safety Sense', 'Apple CarPlay', 'Power Liftgate', 'Hybrid Drive'],
    type: 'SUV',
    description: 'Reliable hybrid SUV with practical space and low fuel usage.',
    gallery: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 9,
    name: 'Honda Civic Type R',
    brand: 'Honda',
    model: 'Civic Type R',
    year: 2023,
    price: 38950,
    mileage: 12000,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    features: ['Turbo Engine', 'Recaro Seats', 'Brembo Brakes', 'Adaptive Damping'],
    type: 'Sedan',
    description: 'Track-inspired sedan focused on handling, control, and feedback.',
    gallery: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 10,
    name: 'Ford Mustang GT',
    brand: 'Ford',
    model: 'Mustang GT',
    year: 2023,
    price: 37965,
    mileage: 10000,
    fuelType: 'Gasoline',
    transmission: 'Manual',
    rating: 5,
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    features: ['5.0L V8', 'Sport Exhaust', 'Track Apps', 'Performance Suspension'],
    type: 'Coupe',
    description: 'Classic muscle coupe with modern performance technology.',
    gallery: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

export default carsSeed;

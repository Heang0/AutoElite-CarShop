import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonImg,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  shareSocialOutline,
  heartOutline,
  heart,
  navigateOutline,
  callOutline,
  calendarNumberOutline,
  speedometerOutline,
  carSportOutline,
  mailOutline,
  cashOutline,
  checkmarkCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { FavoriteService } from '../services/favorite.service';

interface CarFeature {
  icon: string;
  label: string;
  value: string;
}

interface FinanceOption {
  id: number;
  name: string;
  apr: number;
  term: number;
  monthlyPayment: number;
}

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonImg,
    IonFab,
    IonFabButton
  ]
})
export class CarDetailPage implements OnInit {
  car: any;
  isFavorite: boolean = false;
  features: CarFeature[] = [];
  financeOptions: FinanceOption[] = [];
  isFinanceModalOpen = false;
  isContactModalOpen = false;
  contactForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  private route = inject(ActivatedRoute);
  private favoriteService = inject(FavoriteService);

  constructor() {
    addIcons({ shareSocialOutline, heartOutline, heart, navigateOutline, callOutline, calendarNumberOutline, speedometerOutline, carSportOutline, mailOutline, cashOutline, checkmarkCircleOutline, closeCircleOutline });
  }

  ngOnInit() {
    // Get car data from route state (passed from home page)
    const navigation = window.history.state;
    if (navigation && navigation.car) {
      this.car = navigation.car;

      // Create features array based on the car data
      this.features = [
        { icon: 'car-sport-outline', label: 'Brand', value: this.car.brand },
        { icon: 'calendar-number-outline', label: 'Year', value: this.car.year?.toString() ?? 'N/A' },
        { icon: 'navigate-outline', label: 'Mileage', value: `${this.car.mileage?.toLocaleString() ?? 'N/A'} mi` },
        { icon: 'speedometer-outline', label: 'Transmission', value: this.car.transmission ?? 'N/A' }
      ];
    } else {
      // Fallback to getting car ID from route params
      const carId = this.route.snapshot.paramMap.get('id');

      // For demo purposes, we'll use mock data if no car is passed
      // In a real app, you would fetch from a service based on the ID
      this.car = {
        id: parseInt(carId || '1'),
        name: 'BMW M5 Competition',
        brand: 'BMW',
        model: 'M5 Competition',
        year: 2023,
        price: 115900,
        mileage: 15000,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        engine: '4.4L V8 Twin-Turbo',
        horsepower: 617,
        torque: 553,
        acceleration: '3.1 sec 0-60 mph',
        topSpeed: '189 mph',
        color: 'Alpine White',
        interiorColor: 'Black Merino Leather',
        doors: 4,
        seats: 5,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // Matching car image
        gallery: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        ],
        features: [
          { icon: 'car-sport-outline', label: 'Engine', value: '4.4L V8 Twin-Turbo' },
          { icon: 'speedometer-outline', label: 'HP', value: '617 HP' },
          { icon: 'calendar-number-outline', label: 'Year', value: '2023' },
          { icon: 'navigate-outline', label: 'Mileage', value: '15,000 mi' }
        ],
        description: 'The BMW M5 Competition combines luxury with high-performance capabilities. Featuring a twin-turbocharged V8 engine, this sedan delivers exhilarating acceleration and refined driving dynamics.',
        specifications: [
          { label: 'Engine', value: '4.4L V8 Twin-Turbo' },
          { label: 'Transmission', value: '8-Speed Automatic' },
          { label: 'Drivetrain', value: 'Rear-Wheel Drive' },
          { label: 'Fuel Economy', value: '15 city / 21 highway' },
          { label: 'Seating Capacity', value: '5 passengers' },
          { label: 'Cargo Space', value: '19.4 cu ft' }
        ],
        isFavorite: false // Initialize as not favorite
      };
    }

    this.ensureOptionalDetails();

    // Initialize favorite status based on service
    this.isFavorite = this.favoriteService.isFavorite(this.car.id);
    this.car.isFavorite = this.isFavorite;

    // If features weren't set from the passed car data, use the default features
    if (!this.features || this.features.length === 0) {
      this.features = this.car.features || [
        { icon: 'car-sport-outline', label: 'Engine', value: this.car.engine || 'N/A' },
        { icon: 'speedometer-outline', label: 'HP', value: `${this.car.horsepower || 'N/A'} HP` },
        { icon: 'calendar-number-outline', label: 'Year', value: this.car.year.toString() },
        { icon: 'navigate-outline', label: 'Mileage', value: `${this.car.mileage?.toLocaleString() || 'N/A'} mi` }
      ];
    }

    // Initialize finance options
    this.calculateFinanceOptions();
  }

  calculateFinanceOptions() {
    // Calculate different financing options based on car price
    const price = this.car.price;
    this.financeOptions = [
      {
        id: 1,
        name: 'Standard Financing',
        apr: 3.9,
        term: 60,
        monthlyPayment: this.calculateMonthlyPayment(price, 3.9, 60)
      },
      {
        id: 2,
        name: 'Premium Financing',
        apr: 2.9,
        term: 72,
        monthlyPayment: this.calculateMonthlyPayment(price, 2.9, 72)
      },
      {
        id: 3,
        name: 'Lease Option',
        apr: 3.5,
        term: 36,
        monthlyPayment: this.calculateMonthlyPayment(price * 0.7, 3.5, 36) // Lease is typically 70% of MSRP
      }
    ];
  }

  calculateMonthlyPayment(principal: number, apr: number, term: number): number {
    const monthlyRate = apr / 100 / 12;
    const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, term) /
      (Math.pow(1 + monthlyRate, term) - 1);
    return Math.round(payment);
  }

  toggleFavorite() {
    if (this.car) {
      this.favoriteService.toggleFavorite(this.car);
      this.isFavorite = this.car.isFavorite;
    }
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  contactDealer() {
    this.isContactModalOpen = true;
  }

  scheduleTestDrive() {
    alert('Scheduling test drive for ' + this.car.name);
  }

  openFinanceCalculator() {
    this.isFinanceModalOpen = true;
  }

  submitContactForm() {
    console.log('Contact form submitted:', this.contactForm);
    // Reset form
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    // Close modal
    this.isContactModalOpen = false;
    alert('Thank you for contacting us! We will reach out to you shortly.');
  }

  reserveCar() {
    alert(`Reservation confirmed for ${this.car.name}! A representative will contact you shortly.`);
  }

  private ensureOptionalDetails() {
    if (!this.car) {
      return;
    }

    const gallerySource =
      Array.isArray(this.car.gallery) && this.car.gallery.length
        ? this.car.gallery
        : this.car.image
          ? [this.car.image]
          : [];
    this.car.gallery = gallerySource;

    const brandModel = `${this.car.brand ?? ''} ${this.car.model ?? ''}`.trim();
    this.car.description =
      this.car.description ||
      (brandModel
        ? `${brandModel} is styled for premium comfort and performance tailored to your lifestyle.`
        : 'Explore this vehicle to see if it matches your driving needs.');

    const mileageText =
      typeof this.car.mileage === 'number'
        ? `${this.car.mileage.toLocaleString()} mi`
        : 'N/A';

    this.car.specifications =
      this.car.specifications && this.car.specifications.length
        ? this.car.specifications
        : [
            { label: 'Year', value: this.car.year ? this.car.year.toString() : 'N/A' },
            { label: 'Mileage', value: mileageText },
            { label: 'Fuel Type', value: this.car.fuelType || 'N/A' },
            { label: 'Transmission', value: this.car.transmission || 'N/A' }
          ];
  }
}

import { Component, OnInit } from '@angular/core';
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

  constructor(private route: ActivatedRoute) {
    addIcons({
      'share-social-outline': shareSocialOutline,
      'heart-outline': heartOutline,
      'heart': heart,
      'navigate-outline': navigateOutline,
      'call-outline': callOutline,
      'calendar-number-outline': calendarNumberOutline,
      'speedometer-outline': speedometerOutline,
      'car-sport-outline': carSportOutline,
      'mail-outline': mailOutline,
      'cash-outline': cashOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'close-circle-outline': closeCircleOutline
    });
  }

  ngOnInit() {
    // Get car ID from route params
    const carId = this.route.snapshot.paramMap.get('id');

    // For demo purposes, we'll use mock data
    // In a real app, you would fetch from a service
    this.car = {
      id: 1,
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
      image: 'assets/products/nike_red.png', // Placeholder - will replace with actual car image
      gallery: [
        'assets/products/nike_red.png',
        'assets/products/purple_sneaker.png',
        'assets/products/red_handbag.png',
        'assets/products/nike_run_defy.avif'
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
      ]
    };

    this.features = this.car.features;

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
    this.isFavorite = !this.isFavorite;
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
}
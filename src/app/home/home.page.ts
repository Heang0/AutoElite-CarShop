import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonImg,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonRange,
  IonCheckbox,
  IonInput,
  IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  closeOutline,
  carSportOutline,
  carOutline,
  speedometerOutline,
  star,
  starOutline,
  heart,
  heartOutline,
  arrowForwardOutline,
  home,
  compassOutline,
  cartOutline,
  personOutline,
  shareSocialOutline,
  navigateOutline,
  informationCircleOutline,
  menuOutline,
  notificationsOutline,
  filterOutline,
  diamondOutline,
  flashOutline,
  chevronDownOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import type { RangeValue } from '@ionic/core';
import { FavoriteService } from '../services/favorite.service';
import { NOTIFICATION_ITEMS, NotificationItem } from '../data/notifications.data';

interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  rating: number;
  image: string;
  isFavorite: boolean;
  features: string[];
  type: string;
}

interface Brand {
  name: string;
  logoUrl: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonSearchbar,
    IonImg,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonList,
    IonItem,
    IonNote,
    IonLabel,
    IonCheckbox,
    IonInput,
    IonRange,
    IonChip,
  ]
})
export class HomePage implements OnInit, OnDestroy {
  // All brands
  allBrands: Brand[] = [
    { name: 'BMW', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png' },
    { name: 'Toyota', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnG49Ht9722p0eCdIwm0YoZj0IGBzmI5D49Q&s' },
    { name: 'Tesla', logoUrl: 'https://images.seeklogo.com/logo-png/32/2/tesla-logo-png_seeklogo-329764.png' },
    { name: 'Mercedes-Benz', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sQrhXzGVXL4p6E2E2N5EGzs6w2xt0jV4qg&s' },
    { name: 'Audi', logoUrl: 'https://di-uploads-pod3.dealerinspire.com/vindeversautohausofsylvania/uploads/2018/10/Audi-Logo-Banner.png' },
    { name: 'Honda', logoUrl: 'https://live.staticflickr.com/3453/3747525628_5f0fab0ba0_b.jpg' },
    { name: 'Ford', logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh4GLoB0Iij4pTRbqc_hurShO4h4JV4Lr4jQ&s' },
    { name: 'Nissan', logoUrl: 'https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-nissan-vector-PNG.png' }
  ];

  // Brands to display initially
  displayedBrands: Brand[] = this.allBrands.slice(0, 4);
  showAllBrands: boolean = false;

  // Slideshow data
  slides: Slide[] = [
    {
      id: 1,
      title: 'Luxury Sedans',
      subtitle: 'Experience ultimate comfort',
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      ctaText: 'View Collection'
    },
    {
      id: 2,
      title: 'Sports Cars',
      subtitle: 'Feel the power',
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      ctaText: 'Explore Models'
    },
    {
      id: 3,
      title: 'Electric Vehicles',
      subtitle: 'Future of driving',
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      ctaText: 'Go Electric'
    }
  ];

  // All cars data
  allCars: Car[] = [
    // BMW Cars
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
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound'],
      type: 'Sedan'
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
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: true,
      features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension'],
      type: 'SUV'
    },
    // Mercedes Cars
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
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: true,
      features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension'],
      type: 'SUV'
    },
    {
      id: 4,
      name: 'Mercedes-Benz S-Class',
      brand: 'Mercedes-Benz',
      model: 'S 580',
      year: 2023,
      price: 116500,
      mileage: 8000,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Massaging Seats', 'Air Purification', 'Burmester Sound', 'Magic Sky Control'],
      type: 'Sedan'
    },
    // Audi Cars
    {
      id: 5,
      name: 'Audi RS7 Sportback',
      brand: 'Audi',
      model: 'RS7 Sportback',
      year: 2023,
      price: 119900,
      mileage: 8500,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Quattro AWD', 'Virtual Cockpit', 'Matrix LED Headlights', 'Bang & Olufsen Sound'],
      type: 'Coupe'
    },
    {
      id: 6,
      name: 'Audi Q8',
      brand: 'Audi',
      model: 'Q8',
      year: 2023,
      price: 84700,
      mileage: 10000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Virtual Cockpit Plus', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Valcona Leather'],
      type: 'SUV'
    },
    // Tesla Cars
    {
      id: 7,
      name: 'Tesla Model S Plaid',
      brand: 'Tesla',
      model: 'Model S Plaid',
      year: 2023,
      price: 135990,
      mileage: 5000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Autopilot', '17-inch Touchscreen', 'Premium Interior', 'Ludicrous Mode'],
      type: 'Sedan'
    },
    {
      id: 8,
      name: 'Tesla Model 3',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2023,
      price: 42990,
      mileage: 15000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: true,
      features: ['Autopilot', 'Premium Interior', 'Supercharging', 'OTA Updates'],
      type: 'Sedan'
    },
    // Toyota Cars
    {
      id: 9,
      name: 'Toyota Camry TRD',
      brand: 'Toyota',
      model: 'Camry TRD',
      year: 2023,
      price: 32485,
      mileage: 20000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['TRD Sport Suspension', '19-inch Wheels', 'Unique Styling', '8-inch Touchscreen'],
      type: 'Sedan'
    },
    {
      id: 10,
      name: 'Toyota RAV4 Hybrid',
      brand: 'Toyota',
      model: 'RAV4 Hybrid',
      year: 2023,
      price: 28475,
      mileage: 18000,
      fuelType: 'Hybrid',
      transmission: 'CVT',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Hybrid System', 'Apple CarPlay', 'Safety Sense 2.0', 'Power Liftgate'],
      type: 'SUV'
    },
    // Honda Cars
    {
      id: 11,
      name: 'Honda Civic Type R',
      brand: 'Honda',
      model: 'Civic Type R',
      year: 2023,
      price: 38950,
      mileage: 12000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: true,
      features: ['Turbo Engine', 'Recaro Seats', 'Brembo Brakes', 'Adaptive Damper System'],
      type: 'Sedan'
    },
    {
      id: 12,
      name: 'Honda Accord',
      brand: 'Honda',
      model: 'Accord',
      year: 2023,
      price: 26520,
      mileage: 15000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['Honda Sensing Suite', 'Wireless Charging', 'Apple CarPlay', 'LaneWatch'],
      type: 'Sedan'
    },
    // Ford Cars
    {
      id: 13,
      name: 'Ford Mustang GT',
      brand: 'Ford',
      model: 'Mustang GT',
      year: 2023,
      price: 37965,
      mileage: 10000,
      fuelType: 'Gasoline',
      transmission: 'Manual',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['5.0L V8 Engine', 'MagneRide Damping', 'Track Apps', '12-Speaker Audio'],
      type: 'Coupe'
    },
    {
      id: 14,
      name: 'Ford F-150 Raptor',
      brand: 'Ford',
      model: 'F-150 Raptor',
      year: 2023,
      price: 65495,
      mileage: 8000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: true,
      features: ['High-Performance Off-Road', 'FOX Shocks', 'Terrain Management', '12.4-inch Touchscreen'],
      type: 'Pickup'
    },
    // Nissan Cars
    {
      id: 15,
      name: 'Nissan GT-R',
      brand: 'Nissan',
      model: 'GT-R Premium',
      year: 2023,
      price: 113540,
      mileage: 5000,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['All-Wheel Drive', 'Premium Interior', 'Premium Sound', 'Advanced Climate'],
      type: 'Coupe'
    },
    {
      id: 16,
      name: 'Nissan Altima',
      brand: 'Nissan',
      model: 'Altima SR',
      year: 2023,
      price: 26850,
      mileage: 14000,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      isFavorite: false,
      features: ['ProPILOT Assist', 'NissanConnect', 'Apple CarPlay', 'Wireless Charging'],
      type: 'Sedan'
    }
  ];

  // Current cars to display
  cars: Car[] = [];

  selectedCategory: number | null = null;
  isSearching: boolean = false;
  searchQuery: string = '';
  activeTab: string = 'home';
  cartItemCount: number = 0;
  isNotificationsOpen: boolean = false;
  notificationItems: NotificationItem[] = NOTIFICATION_ITEMS;
  selectedNotification: NotificationItem | null = null;
  isFilterOpen: boolean = false;
  brandSearchQuery: string = '';
  selectedBrands: string[] = [];
  activeBrands: string[] = [];
  carTypeOptions: string[] = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Van'];
  selectedCarTypes: string[] = [];
  activeCarTypes: string[] = [];
  priceBounds = { min: 20000, max: 200000 };
  private readonly defaultPriceRange = { lower: 20000, upper: 140000 };
  activePriceRange = { ...this.defaultPriceRange };
  pendingPriceRange = { ...this.defaultPriceRange };

  // Slideshow properties
  currentSlideIndex: number = 0;
  autoSlideInterval: any;

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);

  constructor() {
    // Register all icons
    addIcons({
      'search-outline': searchOutline,
      'close-outline': closeOutline,
      'car-outline': carOutline,
      'car-sport-outline': carSportOutline,
      'speedometer-outline': speedometerOutline,
      'star': star,
      'star-outline': starOutline,
      'heart': heart,
      'heart-outline': heartOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'home': home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      'information-circle-outline': informationCircleOutline,
      'menu-outline': menuOutline,
      'notifications-outline': notificationsOutline,
      'filter-outline': filterOutline,
      'diamond-outline': diamondOutline,
      'flash-outline': flashOutline,
      'chevron-down-outline': chevronDownOutline,
      'chevron-back-outline': chevronBackOutline,
      'chevron-forward-outline': chevronForwardOutline
    });

  }

  toggleBrands() {
    this.showAllBrands = !this.showAllBrands;
    if (this.showAllBrands) {
      this.displayedBrands = [...this.allBrands]; // Show all brands
    } else {
      this.displayedBrands = this.allBrands.slice(0, 4); // Show only first 4 brands
    }
  }

  onBrandClick(brand: string) {
    const isAlreadyActive = this.activeBrands.includes(brand);
    this.activeBrands = isAlreadyActive ? [] : [brand];
    this.selectedBrands = [...this.activeBrands];
    this.activeCarTypes = [];
    this.selectedCarTypes = [];
    this.rebuildCarList();
  }

  onCarClick(car: Car) {
    this.router.navigate(['/car', car.id], { state: { car: car } });
  }

  toggleFavorite(car: Car, event: Event) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);
    this.rebuildCarList();

    // Add haptic feedback on favorite
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    console.log('Searching for:', this.searchQuery);
  }

  onTabChange(tabName: string) {
    this.activeTab = tabName;
    console.log('Active tab changed to:', tabName);

    switch(tabName) {
      case 'home':
        this.router.navigate(['/tabs/home']);
        break;
      case 'explore':
        this.router.navigate(['/tabs/explore']);
        break;
      case 'favorites':
        this.router.navigate(['/tabs/favorites']);
        break;
      case 'account':
        this.router.navigate(['/tabs/account']);
        break;
      default:
        this.router.navigate(['/tabs/home']);
        break;
    }
  }


  addToCart(car: Car) {
    this.cartItemCount++;
    console.log('Added to cart:', car.name);

    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  // Slideshow methods
  ngOnInit() {
    this.rebuildCarList();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  openMenu() {
    console.log('Menu button clicked');
    // In a real app, this would open a side menu or action sheet
    alert('Menu functionality would open here');
  }

  showNotifications(event?: Event) {
    event?.stopPropagation();
    console.log('Notifications button clicked');
    this.isNotificationsOpen = true;
    if (!this.selectedNotification && this.notificationItems.length) {
      this.selectedNotification = this.notificationItems[0];
    }
  }

  clearNotifications() {
    this.isNotificationsOpen = false;
    this.selectedNotification = null;
    console.log('Cleared notification list');
  }

  dismissNotifications() {
    this.isNotificationsOpen = false;
  }

  handleNotificationClick(notification: NotificationItem) {
    this.selectedNotification = notification;
  }

  toggleFilterPanel(event?: Event) {
    event?.stopPropagation();
    if (this.isFilterOpen) {
      this.dismissFilterPanel();
    } else {
      this.openFilterPanel();
    }
  }

  openFilterPanel() {
    this.brandSearchQuery = '';
    this.selectedBrands = [...this.activeBrands];
    this.selectedCarTypes = [...this.activeCarTypes];
    this.pendingPriceRange = { ...this.activePriceRange };
    this.isFilterOpen = true;
  }

  dismissFilterPanel() {
    this.isFilterOpen = false;
  }

  updatePriceRange(value: RangeValue) {
    if (!value || typeof value === 'number') {
      return;
    }

    const { lower, upper } = value;
    if (typeof lower === 'number' && typeof upper === 'number') {
      this.pendingPriceRange = { lower, upper };
    }
  }

  applyFilterChanges() {
    this.activeBrands = [...this.selectedBrands];
    this.activeCarTypes = [...this.selectedCarTypes];
    this.activePriceRange = { ...this.pendingPriceRange };
    this.isFilterOpen = false;
    this.rebuildCarList();
  }

  resetFilters(event?: Event) {
    event?.stopPropagation();
    this.brandSearchQuery = '';
    this.selectedBrands = [];
    this.activeBrands = [];
    this.selectedCarTypes = [];
    this.activeCarTypes = [];
    this.pendingPriceRange = { ...this.defaultPriceRange };
    this.activePriceRange = { ...this.defaultPriceRange };
    this.rebuildCarList();
  }

  toggleBrandSelection(brand: string) {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands = this.selectedBrands.filter(b => b !== brand);
    } else {
      this.selectedBrands = [...this.selectedBrands, brand];
    }
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.includes(brand);
  }

  get filteredBrandOptions(): string[] {
    const query = this.brandSearchQuery.trim().toLowerCase();
    const names = Array.from(new Set(this.allBrands.map(brand => brand.name)));
    if (!query) {
      return names;
    }
    return names.filter(name => name.toLowerCase().includes(query));
  }

  toggleCarTypeSelection(type: string) {
    const index = this.selectedCarTypes.indexOf(type);
    if (index > -1) {
      this.selectedCarTypes = this.selectedCarTypes.filter(t => t !== type);
    } else {
      this.selectedCarTypes = [...this.selectedCarTypes, type];
    }
  }

  isCarTypeSelected(type: string): boolean {
    return this.selectedCarTypes.includes(type);
  }

  updatePendingPrice(field: 'lower' | 'upper', value: string | number | null | undefined) {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return;
    }

    const clampedLower = Math.max(this.priceBounds.min, Math.min(parsed, this.priceBounds.max));
    const clampedUpper = Math.max(this.priceBounds.min, Math.min(parsed, this.priceBounds.max));

    if (field === 'lower') {
      const lower = Math.min(clampedLower, this.pendingPriceRange.upper);
      this.pendingPriceRange = { ...this.pendingPriceRange, lower };
    } else {
      const upper = Math.max(clampedUpper, this.pendingPriceRange.lower);
      this.pendingPriceRange = { ...this.pendingPriceRange, upper };
    }
  }

  get hasActiveFilters(): boolean {
    return this.activeBrands.length > 0 || this.activeCarTypes.length > 0 || this.isPriceFilterActive;
  }

  get isPriceFilterActive(): boolean {
    return (
      this.activePriceRange.lower > this.priceBounds.min ||
      this.activePriceRange.upper < this.priceBounds.max
    );
  }

  private rebuildCarList() {
    this.favoriteService.syncFavorites(this.allCars);
    let filtered = [...this.allCars];

    if (this.activeBrands.length) {
      filtered = filtered.filter(car => this.activeBrands.includes(car.brand));
    }

    if (this.activeCarTypes.length) {
      filtered = filtered.filter(car => this.activeCarTypes.includes(car.type));
    }

    this.cars = filtered.filter(
      car =>
        car.price >= this.activePriceRange.lower && car.price <= this.activePriceRange.upper
    );
  }

  scrollToCarCards() {
    // Scroll to the car cards section
    const carSection = document.querySelector('.popular-cars-section');
    if (carSection) {
      carSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

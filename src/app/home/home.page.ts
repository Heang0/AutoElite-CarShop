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
  IonButtons
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
import { FavoriteService } from '../services/favorite.service';
import { filter } from 'rxjs/operators';

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
}

interface Brand {
  name: string;
  logoUrl: string;
}

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
    IonButtons
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
      features: ['Leather Seats', 'Sunroof', 'Navigation', 'Premium Sound']
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
      features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension']
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
      features: ['360 Camera', 'Heated Seats', 'Panoramic Sunroof', 'Air Suspension']
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
      features: ['Massaging Seats', 'Air Purification', 'Burmester Sound', 'Magic Sky Control']
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
      features: ['Quattro AWD', 'Virtual Cockpit', 'Matrix LED Headlights', 'Bang & Olufsen Sound']
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
      features: ['Virtual Cockpit Plus', 'Matrix LED Headlights', 'Panoramic Sunroof', 'Valcona Leather']
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
      features: ['Autopilot', '17-inch Touchscreen', 'Premium Interior', 'Ludicrous Mode']
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
      features: ['Autopilot', 'Premium Interior', 'Supercharging', 'OTA Updates']
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
      features: ['TRD Sport Suspension', '19-inch Wheels', 'Unique Styling', '8-inch Touchscreen']
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
      features: ['Hybrid System', 'Apple CarPlay', 'Safety Sense 2.0', 'Power Liftgate']
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
      features: ['Turbo Engine', 'Recaro Seats', 'Brembo Brakes', 'Adaptive Damper System']
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
      features: ['Honda Sensing Suite', 'Wireless Charging', 'Apple CarPlay', 'LaneWatch']
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
      features: ['5.0L V8 Engine', 'MagneRide Damping', 'Track Apps', '12-Speaker Audio']
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
      features: ['High-Performance Off-Road', 'FOX Shocks', 'Terrain Management', '12.4-inch Touchscreen']
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
      features: ['All-Wheel Drive', 'Premium Interior', 'Premium Sound', 'Advanced Climate']
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
      features: ['ProPILOT Assist', 'NissanConnect', 'Apple CarPlay', 'Wireless Charging']
    }
  ];

  // Current cars to display
  cars: Car[] = [];

  // Currently selected brand filter
  activeBrand: string | null = null;

  selectedCategory: number | null = null;
  isSearching: boolean = false;
  searchQuery: string = '';
  activeTab: string = 'home';
  cartItemCount: number = 0;

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
    const nextBrand = this.activeBrand === brand ? null : brand;
    this.applyCarFilter(nextBrand);
  }

  clearBrandFilter() {
    this.applyCarFilter(null);
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

  showNotifications() {
    console.log('Notifications button clicked');
    // In a real app, this would navigate to notifications page or show a popup
    alert('Notifications would show here');
  }

  private applyCarFilter(brand: string | null) {
    this.activeBrand = brand;
    this.rebuildCarList();
  }

  private rebuildCarList() {
    this.favoriteService.syncFavorites(this.allCars);
    this.cars =
      this.activeBrand && this.activeBrand.length
        ? this.allCars.filter(car => car.brand === this.activeBrand)
        : [...this.allCars];
  }

  scrollToCarCards() {
    // Scroll to the car cards section
    const carSection = document.querySelector('.popular-cars-section');
    if (carSection) {
      carSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

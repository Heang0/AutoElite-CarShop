import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  IonChip,
  IonMenu,
  IonMenuToggle
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
  chevronForwardOutline,
  logOutOutline,
  timeOutline,
  cashOutline,
  settingsOutline,
  helpCircleOutline
} from 'ionicons/icons';
import type { RangeValue } from '@ionic/core';
import { FavoriteService, type Car } from '../services/favorite.service';
import { CarApiService } from '../services/car-api.service';
import { FirestoreService } from '../services/firestore.service';
import { NOTIFICATION_ITEMS, type NotificationItem } from '../data/notifications.data';

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

const DEFAULT_BRAND_LOGO =
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=200&q=60';

const BRAND_LOGOS: Record<string, string> = {
  Audi: 'https://di-uploads-pod3.dealerinspire.com/vindeversautohausofsylvania/uploads/2018/10/Audi-Logo-Banner.png',
  BMW: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/200px-BMW.svg.png',
  Ford: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh4GLoB0Iij4pTRbqc_hurShO4h4JV4Lr4jQ&s',
  Honda: 'https://live.staticflickr.com/3453/3747525628_5f0fab0ba0_b.jpg',
  'Mercedes-Benz':
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sQrhXzGVXL4p6E2E2N5EGzs6w2xt0jV4qg&s',
  Nissan: 'https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-nissan-vector-PNG.png',
  Tesla: 'https://images.seeklogo.com/logo-png/32/2/tesla-logo-png_seeklogo-329764.png',
  Toyota: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnG49Ht9722p0eCdIwm0YoZj0IGBzmI5D49Q&s'
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
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
    IonMenu,
    IonMenuToggle
  ]
})
export class HomePage implements OnInit, OnDestroy {
  allBrands: Brand[] = [];
  displayedBrands: Brand[] = [];
  showAllBrands = false;

  slides: Slide[] = [
    {
      id: 1,
      title: 'Executive Collection',
      subtitle: 'High-end sedans for refined daily driving',
      image:
        'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'View Collection'
    },
    {
      id: 2,
      title: 'Performance Series',
      subtitle: 'Power and control in every turn',
      image:
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Explore Models'
    },
    {
      id: 3,
      title: 'Electric Flagships',
      subtitle: 'Modern technology with premium comfort',
      image:
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
      ctaText: 'Go Electric'
    }
  ];

  allCars: Car[] = [];
  cars: Car[] = [];
  isLoadingCars = false;
  carsError = '';

  isSearching = false;
  searchQuery = '';
  isNotificationsOpen = false;
  notificationItems: NotificationItem[] = NOTIFICATION_ITEMS;
  selectedNotification: NotificationItem | null = null;
  isFilterOpen = false;
  brandSearchQuery = '';
  selectedBrands: string[] = [];
  activeBrands: string[] = [];
  carTypeOptions: string[] = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Van'];
  selectedCarTypes: string[] = [];
  activeCarTypes: string[] = [];
  priceBounds = { min: 20000, max: 200000 };
  private readonly defaultPriceRange = { lower: 20000, upper: 140000 };
  activePriceRange = { ...this.defaultPriceRange };
  pendingPriceRange = { ...this.defaultPriceRange };

  currentSlideIndex = 0;
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;
  isLoggedIn = false;
  
  menuItems = [
    { title: 'Home', icon: 'home', url: '/tabs/home' },
    { title: 'Explore', icon: 'compass-outline', url: '/tabs/explore' },
    { title: 'Favorites', icon: 'heart-outline', url: '/tabs/favorites' },
    { title: 'Account', icon: 'person-outline', url: '/tabs/account' },
    { title: 'Recently Viewed', icon: 'time-outline', url: '/recently-viewed' },
    { title: 'Trade-In', icon: 'cash-outline', url: '/trade-in' },
    { title: 'Compare Cars', icon: 'swap-horizontal-outline', url: '/compare-cars' }
  ];

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);
  private carApi = inject(CarApiService);
  private firestoreService = inject(FirestoreService);

  constructor() {
    addIcons({
      'search-outline': searchOutline,
      'close-outline': closeOutline,
      'car-outline': carOutline,
      'car-sport-outline': carSportOutline,
      'speedometer-outline': speedometerOutline,
      star,
      'star-outline': starOutline,
      heart,
      'heart-outline': heartOutline,
      'arrow-forward-outline': arrowForwardOutline,
      home,
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
      'chevron-forward-outline': chevronForwardOutline,
      'time-outline': timeOutline,
      'cash-outline': cashOutline,
      'settings-outline': settingsOutline,
      'help-circle-outline': helpCircleOutline
    });
  }

  ngOnInit(): void {
    this.loadCars();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  toggleBrands(): void {
    this.showAllBrands = !this.showAllBrands;
    this.displayedBrands = this.showAllBrands ? [...this.allBrands] : this.allBrands.slice(0, 4);
  }

  onBrandClick(brand: string): void {
    const isAlreadyActive = this.activeBrands.includes(brand);
    this.activeBrands = isAlreadyActive ? [] : [brand];
    this.selectedBrands = [...this.activeBrands];
    this.activeCarTypes = [];
    this.selectedCarTypes = [];
    this.rebuildCarList();
  }

  onCarClick(car: Car): void {
    this.router.navigate(['/car', car.id], { state: { car } });
  }

  toggleFavorite(car: Car, event: Event): void {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);
    this.rebuildCarList();

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  onSearch(event: any): void {
    this.searchQuery = event?.detail?.value ?? '';
    this.rebuildCarList();
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
  }

  getStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }

  openMenu(): void {
    const menu = document.querySelector('ion-menu') as HTMLIonMenuElement;
    if (menu) {
      menu.toggle();
    }
  }

  logout() {
    this.firestoreService.signOut().then(() => {
      this.isLoggedIn = false;
      const menu = document.querySelector('ion-menu') as HTMLIonMenuElement;
      if (menu) {
        menu.close();
      }
      this.router.navigate(['/auth']);
    });
  }

  showNotifications(event?: Event): void {
    event?.stopPropagation();
    this.isNotificationsOpen = true;
    if (!this.selectedNotification && this.notificationItems.length) {
      this.selectedNotification = this.notificationItems[0];
    }
  }

  clearNotifications(): void {
    this.isNotificationsOpen = false;
    this.selectedNotification = null;
  }

  dismissNotifications(): void {
    this.isNotificationsOpen = false;
  }

  handleNotificationClick(notification: NotificationItem): void {
    this.selectedNotification = notification;
  }

  toggleFilterPanel(event?: Event): void {
    event?.stopPropagation();
    if (this.isFilterOpen) {
      this.dismissFilterPanel();
    } else {
      this.openFilterPanel();
    }
  }

  openFilterPanel(): void {
    this.brandSearchQuery = '';
    this.selectedBrands = [...this.activeBrands];
    this.selectedCarTypes = [...this.activeCarTypes];
    this.pendingPriceRange = { ...this.activePriceRange };
    this.isFilterOpen = true;
  }

  dismissFilterPanel(): void {
    this.isFilterOpen = false;
  }

  updatePriceRange(value: RangeValue): void {
    if (!value || typeof value === 'number') {
      return;
    }

    const { lower, upper } = value;
    if (typeof lower === 'number' && typeof upper === 'number') {
      this.pendingPriceRange = { lower, upper };
    }
  }

  applyFilterChanges(): void {
    this.activeBrands = [...this.selectedBrands];
    this.activeCarTypes = [...this.selectedCarTypes];
    this.activePriceRange = { ...this.pendingPriceRange };
    this.isFilterOpen = false;
    this.rebuildCarList();
  }

  resetFilters(event?: Event): void {
    event?.stopPropagation();
    this.brandSearchQuery = '';
    this.selectedBrands = [];
    this.activeBrands = [];
    this.selectedCarTypes = [];
    this.activeCarTypes = [];
    this.pendingPriceRange = { ...this.defaultPriceRange };
    this.activePriceRange = { ...this.defaultPriceRange };
    this.searchQuery = '';
    this.rebuildCarList();
  }

  toggleBrandSelection(brand: string): void {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands = this.selectedBrands.filter((selectedBrand) => selectedBrand !== brand);
    } else {
      this.selectedBrands = [...this.selectedBrands, brand];
    }
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.includes(brand);
  }

  get filteredBrandOptions(): string[] {
    const query = this.brandSearchQuery.trim().toLowerCase();
    const names = Array.from(new Set(this.allBrands.map((brand) => brand.name)));
    if (!query) {
      return names;
    }
    return names.filter((name) => name.toLowerCase().includes(query));
  }

  toggleCarTypeSelection(type: string): void {
    const index = this.selectedCarTypes.indexOf(type);
    if (index > -1) {
      this.selectedCarTypes = this.selectedCarTypes.filter((selectedType) => selectedType !== type);
    } else {
      this.selectedCarTypes = [...this.selectedCarTypes, type];
    }
  }

  isCarTypeSelected(type: string): boolean {
    return this.selectedCarTypes.includes(type);
  }

  updatePendingPrice(field: 'lower' | 'upper', value: string | number | null | undefined): void {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return;
    }

    const clamped = Math.max(this.priceBounds.min, Math.min(parsed, this.priceBounds.max));

    if (field === 'lower') {
      const lower = Math.min(clamped, this.pendingPriceRange.upper);
      this.pendingPriceRange = { ...this.pendingPriceRange, lower };
    } else {
      const upper = Math.max(clamped, this.pendingPriceRange.lower);
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

  scrollToCarCards(): void {
    const carSection = document.querySelector('.popular-cars-section');
    if (carSection) {
      carSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private loadCars(): void {
    this.isLoadingCars = true;
    this.carsError = '';

    this.carApi.getCars().subscribe({
      next: (cars) => {
        this.allCars = cars;
        this.syncBrandList();
        this.rebuildCarList();
        this.isLoadingCars = false;
      },
      error: () => {
        this.allCars = [];
        this.syncBrandList();
        this.rebuildCarList();
        this.carsError = 'Unable to load cars. Please check your Firebase configuration.';
        this.isLoadingCars = false;
      }
    });
  }

  private syncBrandList(): void {
    const uniqueBrands = Array.from(new Set(this.allCars.map((car) => car.brand))).sort((a, b) =>
      a.localeCompare(b)
    );

    this.allBrands = uniqueBrands.map((brandName) => ({
      name: brandName,
      logoUrl: BRAND_LOGOS[brandName] || DEFAULT_BRAND_LOGO
    }));

    if (!this.allBrands.length) {
      this.allBrands = Object.keys(BRAND_LOGOS).map((brandName) => ({
        name: brandName,
        logoUrl: BRAND_LOGOS[brandName]
      }));
    }

    this.displayedBrands = this.showAllBrands ? [...this.allBrands] : this.allBrands.slice(0, 4);
  }

  private rebuildCarList(): void {
    this.favoriteService.syncFavorites(this.allCars);
    let filtered = [...this.allCars];

    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query)
      );
    }

    if (this.activeBrands.length) {
      filtered = filtered.filter((car) => this.activeBrands.includes(car.brand));
    }

    if (this.activeCarTypes.length) {
      filtered = filtered.filter((car) => this.activeCarTypes.includes(car.type));
    }

    this.cars = filtered.filter(
      (car) =>
        car.price >= this.activePriceRange.lower && car.price <= this.activePriceRange.upper
    );
  }
}

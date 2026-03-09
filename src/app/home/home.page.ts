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
  IonModal,
  IonFooter,
  IonLabel,
  IonRange,
  IonCheckbox,
  IonInput,
  IonChip,
  IonMenuButton
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
import { FavoriteService, type Car } from '../services/favorite.service';
import { CarApiService } from '../services/car-api.service';
import { NOTIFICATION_ITEMS, type NotificationItem } from '../data/notifications.data';
import { FirestoreService } from '../services/firestore.service';
import { NotificationService } from '../services/notification.service';

interface Brand {
  name: string;
  logoUrl: string;
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
    IonModal,
    IonFooter,
    IonLabel,
    IonCheckbox,
    IonInput,
    IonRange,
    IonChip,
    IonMenuButton
  ]
})
export class HomePage implements OnInit, OnDestroy {
  allBrands: Brand[] = [];
  displayedBrands: Brand[] = [];
  showAllBrands = false;

  allCars: Car[] = [];
  cars: Car[] = [];
  heroCars: Car[] = [];
  currentHeroIndex = 0;
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
  private readonly defaultPriceRange = { lower: this.priceBounds.min, upper: this.priceBounds.max };
  activePriceRange = { ...this.defaultPriceRange };
  pendingPriceRange = { ...this.defaultPriceRange };

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);
  private carApi = inject(CarApiService);
  private firestoreService = inject(FirestoreService);
  private notificationService = inject(NotificationService);
  private heroIntervalId: number | null = null;

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
      'chevron-forward-outline': chevronForwardOutline
    });
  }

  ngOnInit(): void {
    this.loadCars();
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    this.clearHeroAutoSlide();
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

  openCarDetails(car: Car, event: Event): void {
    event.stopPropagation();
    this.onCarClick(car);
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

  getStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }

  get currentHero(): Car | null {
    return this.heroCars[this.currentHeroIndex] ?? null;
  }

  get activeFilterCount(): number {
    let count = 0;

    if (this.activeBrands.length) {
      count += this.activeBrands.length;
    }

    if (this.activeCarTypes.length) {
      count += this.activeCarTypes.length;
    }

    if (this.isPriceFilterActive) {
      count += 1;
    }

    return count;
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
    if (notification.route) {
      this.router.navigateByUrl(notification.route);
    }
    if (typeof notification.id === 'string') {
      void this.notificationService.markAsRead(notification.id);
    }
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

  get isPriceFilterActive(): boolean {
    return (
      this.activePriceRange.lower !== this.defaultPriceRange.lower ||
      this.activePriceRange.upper !== this.defaultPriceRange.upper
    );
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

    this.updateHeroCars();
  }

  private loadNotifications(): void {
    this.firestoreService.onAuthStateChanged(async (user) => {
      if (!user?.uid) {
        this.notificationItems = NOTIFICATION_ITEMS;
        return;
      }

      try {
        const notifications = await this.notificationService.getNotifications(user.uid);
        if (!notifications.length) {
          this.notificationItems = NOTIFICATION_ITEMS;
          return;
        }
        this.notificationItems = notifications.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.body,
          details: item.body,
          icon: item.icon || 'notifications-outline',
          time: this.formatTime(item.createdAt.toDate()),
          route: item.route
        }));
      } catch {
        this.notificationItems = NOTIFICATION_ITEMS;
      }
    });
  }

  private formatTime(date: Date): string {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  private updateHeroCars(): void {
    const baseList = this.cars.length ? this.cars : this.allCars;
    this.heroCars = baseList.slice(0, 3);
    if (this.currentHeroIndex >= this.heroCars.length) {
      this.currentHeroIndex = 0;
    }
    this.resetHeroAutoSlide();
  }

  private resetHeroAutoSlide(): void {
    this.clearHeroAutoSlide();
    if (this.heroCars.length > 1) {
      this.heroIntervalId = window.setInterval(() => {
        this.advanceHero(1);
      }, 3000);
    }
  }

  private clearHeroAutoSlide(): void {
    if (this.heroIntervalId !== null) {
      window.clearInterval(this.heroIntervalId);
      this.heroIntervalId = null;
    }
  }

  private advanceHero(step: number): void {
    if (this.heroCars.length < 2) {
      return;
    }
    const total = this.heroCars.length;
    this.currentHeroIndex = (this.currentHeroIndex + step + total) % total;
  }

  nextHero(): void {
    this.advanceHero(1);
    this.resetHeroAutoSlide();
  }

  prevHero(): void {
    this.advanceHero(-1);
    this.resetHeroAutoSlide();
  }
}

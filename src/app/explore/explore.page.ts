import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type { RangeValue } from '@ionic/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonInput,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg,
  IonButtons,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonCheckbox,
  IonRange,
  IonChip,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  heartOutline,
  heart,
  shareSocialOutline,
  navigateOutline,
  star,
  starOutline,
  searchOutline,
  home,
  compassOutline,
  cartOutline,
  personOutline,
  menuOutline,
  notificationsOutline,
  closeOutline,
  filterOutline
} from 'ionicons/icons';
import { FavoriteService, type Car } from '../services/favorite.service';
import { CarApiService } from '../services/car-api.service';
import { CAR_DATABASE } from '../services/car-data';
import { NOTIFICATION_ITEMS, type NotificationItem } from '../data/notifications.data';

interface Brand {
  name: string;
}

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonInput,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg,
    IonButtons,
    IonList,
    IonItem,
    IonNote,
    IonLabel,
    IonCheckbox,
    IonRange,
    IonChip,
    IonMenuButton
  ]
})
export class ExplorePage implements OnInit {
  allBrands: Brand[] = [];
  allCars: Car[] = [];
  cars: Car[] = [];
  searchQuery = '';
  activeTab = 'explore';
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
  isLoadingCars = false;
  carsError = '';

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);
  private carApi = inject(CarApiService);

  constructor() {
    addIcons({
      'heart-outline': heartOutline,
      heart,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      star,
      'star-outline': starOutline,
      'search-outline': searchOutline,
      home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline,
      'menu-outline': menuOutline,
      'notifications-outline': notificationsOutline,
      'close-outline': closeOutline,
      'filter-outline': filterOutline
    });
  }

  ngOnInit(): void {
    this.loadCars();
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

  onCarClick(car: Car): void {
    this.router.navigate(['/car', car.id], { state: { car } });
  }

  openCarDetails(car: Car, event: Event): void {
    event.stopPropagation();
    this.onCarClick(car);
  }

  onTabChange(tabName: string): void {
    this.activeTab = tabName;

    switch (tabName) {
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

  showNotifications(event?: Event): void {
    event?.stopPropagation();
    this.isNotificationsOpen = true;
    if (!this.selectedNotification && this.notificationItems.length) {
      this.selectedNotification = this.notificationItems[0];
    }
  }

  dismissNotifications(): void {
    this.isNotificationsOpen = false;
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

  updatePriceRange(value: RangeValue): void {
    if (!value || typeof value === 'number') {
      return;
    }

    const { lower, upper } = value;
    if (typeof lower === 'number' && typeof upper === 'number') {
      this.pendingPriceRange = { lower, upper };
    }
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

  get hasActiveFilters(): boolean {
    return this.activeBrands.length > 0 || this.activeCarTypes.length > 0 || this.isPriceFilterActive;
  }

  get isPriceFilterActive(): boolean {
    return (
      this.activePriceRange.lower > this.priceBounds.min ||
      this.activePriceRange.upper < this.priceBounds.max
    );
  }

  clearNotifications(): void {
    this.isNotificationsOpen = false;
  }

  handleNotificationClick(notification: NotificationItem): void {
    this.selectedNotification = notification;
  }

  getStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }

  private loadCars(): void {
    this.isLoadingCars = true;
    this.carsError = '';

    this.carApi.getCars().subscribe({
      next: (cars) => {
        this.allCars = cars;
        this.refreshBrands();
        this.rebuildCarList();
        this.isLoadingCars = false;
      },
      error: () => {
        this.allCars = [...CAR_DATABASE];
        this.refreshBrands();
        this.rebuildCarList();
        this.carsError = 'Live inventory is unavailable. Showing local catalog data.';
        this.isLoadingCars = false;
      }
    });
  }

  private refreshBrands(): void {
    const uniqueBrands = Array.from(new Set(this.allCars.map((car) => car.brand))).sort((a, b) =>
      a.localeCompare(b)
    );
    this.allBrands = uniqueBrands.map((name) => ({ name }));
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

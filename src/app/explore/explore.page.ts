import { Component, inject } from '@angular/core';
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
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonImg,
  IonButtons,
  IonPopover,
  IonList,
  IonItem,
  IonNote,
  IonLabel,
  IonCheckbox,
  IonRange,
  IonInput,
  IonChip
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
import { FavoriteService, Car } from '../services/favorite.service';
import { CAR_DATABASE } from '../services/car-data';
import { NOTIFICATION_ITEMS, NotificationItem } from '../data/notifications.data';

interface Brand {
  name: string;
  logoUrl: string;
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
    IonInput,
    IonChip
  ]
})
export class ExplorePage {
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
  allCars: Car[] = [];
  cars: Car[] = [];
  searchQuery: string = '';
  activeTab: string = 'explore';
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

  private router = inject(Router);
  private favoriteService = inject(FavoriteService);

  constructor() {
    // Register icons
    addIcons({
      'heart-outline': heartOutline,
      'heart': heart,
      'share-social-outline': shareSocialOutline,
      'navigate-outline': navigateOutline,
      'star': star,
      'star-outline': starOutline,
      'search-outline': searchOutline,
      'home': home,
      'compass-outline': compassOutline,
      'cart-outline': cartOutline,
      'person-outline': personOutline,
      'menu-outline': menuOutline,
      'notifications-outline': notificationsOutline,
      'close-outline': closeOutline,
      'filter-outline': filterOutline
    });

    // Initialize with sample data
    this.allCars = [...CAR_DATABASE];
    this.rebuildCarList();

  }

  toggleFavorite(car: Car, event: Event) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite(car);
    this.rebuildCarList();

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value;
    this.rebuildCarList();
  }

  private rebuildCarList() {
    this.favoriteService.syncFavorites(this.allCars);
    let filtered = [...this.allCars];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)
      );
    }

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

  onCarClick(car: Car) {
    this.router.navigate(['/car', car.id], { state: { car: car } });
  }

  onTabChange(tabName: string) {
    this.activeTab = tabName;
    console.log('Active tab changed to:', tabName);

    switch(tabName) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'explore':
        // Already on explore page
        break;
      case 'favorites':
        this.router.navigate(['/favorites']);
        break;
      case 'account':
        // For now, stay on explore - you'll update this later
        break;
      default:
        this.router.navigate(['/home']);
        break;
    }
  }

  openMenu() {
    console.log('Menu button clicked');
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

  dismissNotifications() {
    this.isNotificationsOpen = false;
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

  updatePriceRange(value: RangeValue) {
    if (!value || typeof value === 'number') {
      return;
    }

    const { lower, upper } = value;
    if (typeof lower === 'number' && typeof upper === 'number') {
      this.pendingPriceRange = { lower, upper };
    }
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

  get hasActiveFilters(): boolean {
    return this.activeBrands.length > 0 || this.activeCarTypes.length > 0 || this.isPriceFilterActive;
  }

  get isPriceFilterActive(): boolean {
    return (
      this.activePriceRange.lower > this.priceBounds.min ||
      this.activePriceRange.upper < this.priceBounds.max
    );
  }

  clearNotifications() {
    this.isNotificationsOpen = false;
    console.log('Cleared notification list');
  }

  handleNotificationClick(notification: NotificationItem) {
    this.selectedNotification = notification;
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  IonImg, IonBadge, IonModal, IonTitle, IonToast
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, heartOutline, heartSharp, shareOutline,
  callOutline, mailOutline, locationOutline, speedometerOutline,
  gitCommitOutline, swapHorizontalOutline, peopleOutline, navigateOutline,
  colorPaletteOutline, carSportOutline, flashOutline, informationCircleOutline, checkmarkCircle, imagesOutline, cardOutline,
  closeOutline, chevronBackOutline, chevronForwardOutline
} from 'ionicons/icons';
import { CarApiService } from '../services/car-api.service';
import { FavoriteService } from '../services/favorite.service';
import type { Car } from '../services/favorite.service';
// import { FinanceCalculatorComponent } from '../shared/finance-calculator/finance-calculator.component';
import { ContactDealerComponent } from '../shared/contact-dealer/contact-dealer.component';

@Component({
  selector: 'app-car-detail',
  template: `
    <div class="car-detail-page">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button (click)="goBack()">
              <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Car Details</ion-title>
          <ion-buttons slot="end">
            <ion-button (click)="toggleFavorite()">
              <ion-icon slot="icon-only" [name]="isFavorite ? 'heart-sharp' : 'heart-outline'" 
                        [color]="isFavorite ? 'danger' : ''"></ion-icon>
            </ion-button>
            <ion-button>
              <ion-icon slot="icon-only" name="share-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content *ngIf="car" class="car-detail-content">
        <!-- Image Gallery -->
        <div class="image-gallery">
          <ion-img [src]="car.image" [alt]="car.name" class="main-image"></ion-img>
          <div class="gallery-thumbs" *ngIf="car.gallery && car.gallery.length > 0">
            <div class="thumb" *ngFor="let img of car.gallery" (click)="viewImage(img)">
              <ion-img [src]="img" alt="Gallery"></ion-img>
            </div>
          </div>
          <div class="image-count" *ngIf="car.gallery && car.gallery.length > 0">
            <ion-icon name="images-outline"></ion-icon>
            <span>{{ car.gallery.length + 1 }} Photos</span>
          </div>
        </div>

        <!-- Price & Basic Info -->
        <div class="info-section">
          <h1 class="car-title">{{ car.year }} {{ car.brand }} {{ car.model }}</h1>
          <div class="price-section">
            <span class="price">\${{ car.price | number }}</span>
            <ion-badge color="success" class="condition-badge" *ngIf="car.condition">{{ car.condition }}</ion-badge>
          </div>
          <div class="quick-stats">
            <div class="stat-item">
              <ion-icon name="speedometer-outline"></ion-icon>
              <span>{{ car.mileage | number }} mi</span>
            </div>
            <div class="stat-item">
              <ion-icon name="git-commit-outline"></ion-icon>
              <span>{{ car.fuelType }}</span>
            </div>
            <div class="stat-item">
              <ion-icon name="swap-horizontal-outline"></ion-icon>
              <span>{{ car.transmission }}</span>
            </div>
            <div class="stat-item">
              <ion-icon name="car-sport-outline"></ion-icon>
              <span>{{ car.type }}</span>
            </div>
          </div>
        </div>

        <!-- Key Specs -->
        <div class="specs-section">
          <h2>Key Specifications</h2>
          <div class="specs-grid">
            <div class="spec-item" *ngIf="car.horsepower">
              <div class="spec-icon">
                <ion-icon name="flash-outline"></ion-icon>
              </div>
              <div class="spec-info">
                <span class="spec-value">{{ car.horsepower }} hp</span>
                <span class="spec-label">Horsepower</span>
              </div>
            </div>
            <div class="spec-item" *ngIf="car.mpgCombined">
              <div class="spec-icon">
                <ion-icon name="navigate-outline"></ion-icon>
              </div>
              <div class="spec-info">
                <span class="spec-value">{{ car.mpgCombined }} MPG</span>
                <span class="spec-label">Combined MPG</span>
              </div>
            </div>
            <div class="spec-item" *ngIf="car.seats">
              <div class="spec-icon">
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <div class="spec-info">
                <span class="spec-value">{{ car.seats }} Seats</span>
                <span class="spec-label">Seating</span>
              </div>
            </div>
            <div class="spec-item" *ngIf="car.drivetrain">
              <div class="spec-icon">
                <ion-icon name="information-circle-outline"></ion-icon>
              </div>
              <div class="spec-info">
                <span class="spec-value">{{ car.drivetrain }}</span>
                <span class="spec-label">Drivetrain</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Specs -->
        <div class="full-specs-section" *ngIf="hasFullSpecs">
          <h2>Full Specifications</h2>
          <div class="specs-list">
            <div class="spec-row" *ngIf="car.exteriorColor">
              <span class="spec-label">Exterior Color</span>
              <span class="spec-value">{{ car.exteriorColor }}</span>
            </div>
            <div class="spec-row" *ngIf="car.interiorColor">
              <span class="spec-label">Interior Color</span>
              <span class="spec-value">{{ car.interiorColor }}</span>
            </div>
            <div class="spec-row" *ngIf="car.engine">
              <span class="spec-label">Engine</span>
              <span class="spec-value">{{ car.engine }}</span>
            </div>
            <div class="spec-row" *ngIf="car.transmission">
              <span class="spec-label">Transmission</span>
              <span class="spec-value">{{ car.transmission }}</span>
            </div>
            <div class="spec-row" *ngIf="car.mpgCity || car.mpgHighway">
              <span class="spec-label">MPG</span>
              <span class="spec-value">
                {{ car.mpgCity }}/{{ car.mpgHighway }} City/Hwy
              </span>
            </div>
            <div class="spec-row" *ngIf="car.vin">
              <span class="spec-label">VIN</span>
              <span class="spec-value">{{ car.vin }}</span>
            </div>
            <div class="spec-row" *ngIf="car.stockNumber">
              <span class="spec-label">Stock #</span>
              <span class="spec-value">{{ car.stockNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="features-section" *ngIf="car.features && car.features.length > 0">
          <h2>Features</h2>
          <p class="features-description">Features that are installed on this {{ car.year }} {{ car.brand }} {{ car.model }}.</p>
          <div class="features-grid">
            <div class="feature-item" *ngFor="let feature of car.features">
              <ion-icon name="checkmark-circle" color="primary"></ion-icon>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Dealer -->
        <app-contact-dealer [car]="car" [carName]="car.name"></app-contact-dealer>

        <!-- Buy Now Button -->
        <div class="buy-now-section">
          <ion-button expand="block" color="success" size="large" (click)="buyNow()">
            <ion-icon slot="start" name="card-outline"></ion-icon>
            Buy Now - \${{ car?.price | number }}
          </ion-button>
        </div>

        <!-- Compare Button -->
        <div class="compare-section">
          <ion-button expand="block" fill="outline" (click)="addToCompare()">
            <ion-icon slot="start" name="swap-horizontal-outline"></ion-icon>
            Add to Compare
          </ion-button>
        </div>
      </ion-content>
    </div>

    <!-- Image Viewer Modal -->
    <ion-modal [isOpen]="showImageViewer" (didDismiss)="showImageViewer = false" class="image-viewer-modal">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button (click)="showImageViewer = false">
                <ion-icon slot="icon-only" name="close-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-title>{{ currentImageIndex + 1 }} / {{ allImages.length }}</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="previousImage()" [disabled]="currentImageIndex === 0">
                <ion-icon slot="icon-only" name="chevron-back-outline"></ion-icon>
              </ion-button>
              <ion-button (click)="nextImage()" [disabled]="currentImageIndex === allImages.length - 1">
                <ion-icon slot="icon-only" name="chevron-forward-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="image-viewer-content">
          <div class="image-slider">
            <ion-img [src]="allImages[currentImageIndex]" [alt]="'Image ' + (currentImageIndex + 1)"></ion-img>
          </div>
          <!-- Navigation Arrows -->
          <button class="nav-arrow prev" (click)="previousImage()" [disabled]="currentImageIndex === 0">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <button class="nav-arrow next" (click)="nextImage()" [disabled]="currentImageIndex === allImages.length - 1">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
          <!-- Image Counter -->
          <div class="image-counter">
            {{ currentImageIndex + 1 }} / {{ allImages.length }}
          </div>
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- Toast Notification -->
    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="3000"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false"
    ></ion-toast>
  `,
  styles: [`
    .car-detail-page {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .car-detail-content {
      --background: #f5f7fa;
    }

    .image-gallery {
      position: relative;
      background: white;
    }

    .main-image {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
    }

    .gallery-thumbs {
      display: flex;
      gap: 8px;
      padding: 12px;
      overflow-x: auto;
    }

    .thumb {
      flex-shrink: 0;
      width: 80px;
      height: 60px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }

    .thumb ion-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-count {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }

    .info-section {
      background: white;
      padding: 20px;
      margin-bottom: 12px;
    }

    .car-title {
      margin: 0 0 12px 0;
      font-size: 24px;
      color: #2c3e50;
      font-weight: 700;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .price {
      font-size: 28px;
      font-weight: 700;
      color: #3498db;
    }

    .condition-badge {
      font-size: 12px;
      padding: 4px 12px;
      text-transform: uppercase;
    }

    .quick-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #7f8c8d;
      background: #f8f9fa;
      padding: 8px 12px;
      border-radius: 8px;
    }

    .stat-item ion-icon {
      color: #3498db;
      font-size: 18px;
    }

    .specs-section {
      background: white;
      padding: 20px;
      margin-bottom: 12px;
    }

    .specs-section h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #2c3e50;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .spec-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .spec-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3498db, #2980b9);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spec-icon ion-icon {
      font-size: 20px;
      color: white;
    }

    .spec-info {
      display: flex;
      flex-direction: column;
    }

    .spec-value {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .spec-label {
      font-size: 12px;
      color: #7f8c8d;
    }

    .full-specs-section {
      background: white;
      padding: 20px;
      margin-bottom: 12px;
    }

    .full-specs-section h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #2c3e50;
    }

    .specs-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .spec-row .spec-label {
      font-weight: 500;
      color: #7f8c8d;
    }

    .spec-row .spec-value {
      font-weight: 600;
      color: #2c3e50;
    }

    .features-section {
      background: white;
      padding: 20px;
      margin-bottom: 12px;
    }

    .features-section h2 {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: #2c3e50;
    }

    .features-description {
      margin: 0 0 16px 0;
      font-size: 14px;
      color: #7f8c8d;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #2c3e50;
    }

    .feature-item ion-icon {
      font-size: 20px;
    }

    .contact-section {
      background: white;
      padding: 20px;
      padding-bottom: 40px;
    }

    .contact-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    ion-modal ion-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .image-viewer-modal {
      --height: 100%;
      --max-height: 100vh;
      --width: 100%;
      --max-width: 100vw;
    }

    .image-viewer-modal ion-toolbar {
      --background: rgba(0, 0, 0, 0.8);
      --border-color: rgba(255, 255, 255, 0.1);
    }

    .image-viewer-modal ion-title {
      color: white;
      font-weight: 600;
    }

    .image-viewer-modal ion-button {
      --color: white;
    }

    .image-viewer-content {
      --background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .image-slider {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .image-slider ion-img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }

    .nav-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
    }

    .nav-arrow:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.4);
    }

    .nav-arrow:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .nav-arrow ion-icon {
      font-size: 32px;
    }

    .nav-arrow.prev {
      left: 20px;
    }

    .nav-arrow.next {
      right: 20px;
    }

    .image-counter {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonImg,
    IonBadge,
    IonModal,
    IonTitle,
    IonToast,
    // FinanceCalculatorComponent,
    ContactDealerComponent
  ]
})
export class CarDetailPage implements OnInit {
  car: Car | null = null;
  isFavorite = false;
  showImageViewer = false;
  selectedImage = '';
  currentImageIndex = 0;
  allImages: string[] = [];
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carApi = inject(CarApiService);
  private favoriteService = inject(FavoriteService);

  constructor() {
    addIcons({
      arrowBackOutline, heartOutline, heartSharp, shareOutline,
      callOutline, mailOutline, locationOutline, speedometerOutline,
      gitCommitOutline, swapHorizontalOutline, peopleOutline, navigateOutline,
      colorPaletteOutline, carSportOutline, flashOutline, informationCircleOutline, checkmarkCircle, imagesOutline, cardOutline,
      closeOutline, chevronBackOutline, chevronForwardOutline
    });
  }

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCar(carId);
    }
  }

  loadCar(id: string) {
    this.carApi.getCarById(id).subscribe({
      next: (car) => {
        this.car = car;
        this.isFavorite = this.favoriteService.isFavorite(car.id);
      },
      error: (err) => {
        console.error('Error loading car:', err);
      }
    });
  }

  goBack() {
    window.history.back();
  }

  toggleFavorite() {
    if (this.car) {
      this.favoriteService.toggleFavorite(this.car);
      this.isFavorite = !this.isFavorite;
    }
  }

  viewImage(url: string) {
    // Build array of all images (main + gallery)
    this.allImages = [this.car!.image, ...(this.car!.gallery || [])];
    this.currentImageIndex = this.allImages.indexOf(url);
    if (this.currentImageIndex === -1) {
      this.currentImageIndex = 0;
    }
    this.showImageViewer = true;
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.allImages.length - 1) {
      this.currentImageIndex++;
    }
  }

  addToCompare() {
    if (this.car) {
      const stored = localStorage.getItem('carsToCompare');
      const ids: string[] = stored ? JSON.parse(stored) : [];
      
      if (ids.includes(String(this.car.id))) {
        this.toastMessage = 'Car already in compare list';
        return;
      }
      
      if (ids.length >= 2) {
        this.toastMessage = 'Maximum 2 cars can be compared';
        return;
      }
      
      ids.push(String(this.car.id));
      localStorage.setItem('carsToCompare', JSON.stringify(ids));
      this.toastMessage = 'Added to compare!';
      this.toastColor = 'success';
      this.showToast = true;
    }
  }

  buyNow() {
    if (this.car) {
      this.router.navigate(['/payment', this.car.id]);
    }
  }

  get hasFullSpecs(): boolean {
    if (!this.car) return false;
    return !!(
      this.car.exteriorColor ||
      this.car.interiorColor ||
      this.car.engine ||
      this.car.drivetrain ||
      this.car.vin ||
      this.car.stockNumber
    );
  }
}

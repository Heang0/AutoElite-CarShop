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
      <ion-header class="detail-header">
        <ion-toolbar class="detail-toolbar">
          <ion-buttons slot="start">
            <ion-button class="toolbar-btn" (click)="goBack()">
              <ion-icon slot="icon-only" name="arrow-back-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>{{ car ? car.brand + ' ' + car.model : 'Car Details' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button class="toolbar-btn" (click)="toggleFavorite()">
              <ion-icon slot="icon-only" [name]="isFavorite ? 'heart-sharp' : 'heart-outline'"
                        [color]="isFavorite ? 'danger' : ''"></ion-icon>
            </ion-button>
            <ion-button class="toolbar-btn" (click)="shareCar()">
              <ion-icon slot="icon-only" name="share-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content *ngIf="car" class="car-detail-content">
        <div class="detail-shell">
          <section class="hero-card">
            <div class="image-gallery">
              <div class="carousel" *ngIf="allImages.length > 0">
                <div class="carousel-track" [style.transform]="'translateX(' + (-currentImageIndex * 100) + '%)'">
                  <button
                    type="button"
                    class="carousel-slide"
                    *ngFor="let img of allImages; let i = index"
                    (click)="viewImage(img)"
                    [attr.aria-label]="'View image ' + (i + 1)"
                  >
                    <ion-img [src]="img" [alt]="car.name" class="carousel-media"></ion-img>
                  </button>
                </div>
                <button
                  class="carousel-nav prev"
                  type="button"
                  (click)="previousImage()"
                  [disabled]="currentImageIndex === 0"
                  aria-label="Previous image"
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>
                <button
                  class="carousel-nav next"
                  type="button"
                  (click)="nextImage()"
                  [disabled]="currentImageIndex === allImages.length - 1"
                  aria-label="Next image"
                >
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
                <div class="carousel-dots" *ngIf="allImages.length > 1">
                  <button
                    type="button"
                    class="dot"
                    *ngFor="let img of allImages; let i = index"
                    [class.active]="i === currentImageIndex"
                    (click)="currentImageIndex = i"
                    [attr.aria-label]="'Go to image ' + (i + 1)"
                  ></button>
                </div>
              </div>
              <button class="image-count" *ngIf="allImages.length > 1" (click)="viewImage(allImages[currentImageIndex])">
                <ion-icon name="images-outline"></ion-icon>
                <span>{{ currentImageIndex + 1 }} / {{ allImages.length }}</span>
              </button>
            </div>

            <div class="gallery-thumbs" *ngIf="car.gallery && car.gallery.length > 0">
              <button
                type="button"
                class="thumb"
                *ngFor="let img of allImages; let i = index"
                (click)="currentImageIndex = i"
                [class.active]="i === currentImageIndex"
              >
                <ion-img [src]="img" alt="Gallery"></ion-img>
              </button>
            </div>

            <div class="hero-summary">
              <div class="hero-copy">
                <span class="hero-kicker">{{ car.type }} | {{ car.condition || 'Available now' }}</span>
                <h1 class="car-title">{{ car.year }} {{ car.brand }} {{ car.model }}</h1>
                <p class="hero-subtitle">
                  {{ car.mileage | number }} miles | {{ car.fuelType }} | {{ car.transmission }}
                </p>
              </div>

              <div class="hero-price-row">
                <div>
                  <div class="price">\${{ car.price | number }}</div>
                  <div class="price-note">Estimated retail price</div>
                </div>
                <ion-badge color="success" class="condition-badge" *ngIf="car.condition">{{ car.condition }}</ion-badge>
              </div>

              <div class="quick-stats">
                <div class="stat-item">
                  <ion-icon name="speedometer-outline"></ion-icon>
                  <span>Mileage</span>
                  <strong>{{ car.mileage | number }} mi</strong>
                </div>
                <div class="stat-item">
                  <ion-icon name="git-commit-outline"></ion-icon>
                  <span>Fuel</span>
                  <strong>{{ car.fuelType }}</strong>
                </div>
                <div class="stat-item">
                  <ion-icon name="swap-horizontal-outline"></ion-icon>
                  <span>Transmission</span>
                  <strong>{{ car.transmission }}</strong>
                </div>
                <div class="stat-item">
                  <ion-icon name="car-sport-outline"></ion-icon>
                  <span>Body Type</span>
                  <strong>{{ car.type }}</strong>
                </div>
              </div>
            </div>
          </section>

          <section class="detail-card" *ngIf="hasKeySpecs">
            <div class="section-heading">
              <h2>Key Specifications</h2>
              <p>Quick highlights for this vehicle</p>
            </div>
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
          </section>

          <div class="detail-grid">
            <section class="detail-card" *ngIf="overviewText">
              <div class="section-heading">
                <h2>Overview</h2>
                <p>Vehicle summary</p>
              </div>
              <p class="body-copy">{{ overviewText }}</p>
            </section>

            <section class="detail-card" *ngIf="hasFullSpecs">
              <div class="section-heading">
                <h2>Full Specifications</h2>
                <p>Detailed vehicle data</p>
              </div>
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
                  <span class="spec-value">{{ car.mpgCity }}/{{ car.mpgHighway }} City/Hwy</span>
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
            </section>
          </div>

          <section class="detail-card" *ngIf="car.features && car.features.length > 0">
            <div class="section-heading">
              <h2>Features</h2>
              <p>Installed options and equipment</p>
            </div>
            <div class="features-grid">
              <div class="feature-item" *ngFor="let feature of car.features">
                <ion-icon name="checkmark-circle" color="primary"></ion-icon>
                <span>{{ feature }}</span>
              </div>
            </div>
          </section>

          <section class="detail-card">
            <div class="section-heading">
              <h2>Financing Options</h2>
              <p>Estimated monthly plans</p>
            </div>
            <div class="finance-options">
              <div class="finance-option" *ngFor="let option of financeOptions.slice(0, 2)">
                <div class="option-header">
                  <strong>{{ option.name }}</strong>
                  <span>{{ option.apr }}% APR</span>
                </div>
                <div class="option-meta">
                  <span>{{ option.term }} mo</span>
                  <span>\${{ option.monthlyPayment }}/mo</span>
                </div>
              </div>
            </div>
            <ion-button expand="block" fill="outline" class="section-action" (click)="openFinanceCalculator()">
              View all financing
            </ion-button>
          </section>

          <section class="detail-card detail-card--contact">
            <div class="section-heading">
              <h2>Talk to Dealer</h2>
              <p>Ask for availability, price, or delivery</p>
            </div>
            <app-contact-dealer [car]="car" [carName]="car.name"></app-contact-dealer>
          </section>

          <div class="action-bar">
            <ion-button expand="block" fill="outline" (click)="addToCompare()">
              <ion-icon slot="start" name="swap-horizontal-outline"></ion-icon>
              Compare
            </ion-button>
            <ion-button expand="block" color="success" (click)="buyNow()">
              <ion-icon slot="start" name="card-outline"></ion-icon>
              Buy Now - \${{ car.price | number }}
            </ion-button>
          </div>
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
      min-height: 100vh;
    }

    .car-detail-content {
      --background:
        radial-gradient(circle at top, rgba(15, 23, 42, 0.06), transparent 24%),
        #f3f5f8;
    }

    .detail-header {
      position: sticky;
      top: 0;
      z-index: 30;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }

    .detail-toolbar {
      --background: rgba(255, 255, 255, 0.94);
      --border-width: 0;
      --min-height: 64px;
      --padding-start: 10px;
      --padding-end: 10px;
      backdrop-filter: blur(18px);
    }

    .detail-toolbar ion-title {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
    }

    .toolbar-btn {
      --color: #0f172a;
      --border-radius: 14px;
      --padding-start: 8px;
      --padding-end: 8px;
    }

    .detail-shell {
      padding: 16px 16px calc(112px + env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .hero-card,
    .detail-card {
      background: rgba(255, 255, 255, 0.98);
      border: 1px solid rgba(148, 163, 184, 0.14);
      border-radius: 24px;
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }

    .image-gallery {
      position: relative;
      background: #dfe6ee;
    }

    .carousel {
      position: relative;
      overflow: hidden;
      border-radius: 22px 22px 0 0;
    }

    .carousel-track {
      display: flex;
      width: 100%;
      transition: transform 0.35s ease;
    }

    .carousel-slide {
      appearance: none;
      border: 0;
      padding: 0;
      margin: 0;
      background: transparent;
      width: 100%;
      flex: 0 0 100%;
      cursor: pointer;
    }

    .carousel-media {
      width: 100%;
      height: clamp(240px, 42vw, 420px);
      object-fit: cover;
    }

    .carousel-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.6);
      background: rgba(15, 23, 42, 0.45);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
      z-index: 2;
    }

    .carousel-nav:hover:not(:disabled) {
      background: rgba(15, 23, 42, 0.7);
      transform: translateY(-50%) scale(1.02);
    }

    .carousel-nav:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .carousel-nav.prev {
      left: 12px;
    }

    .carousel-nav.next {
      right: 12px;
    }

    .carousel-dots {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(10px);
    }

    .carousel-dots .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      border: 0;
      background: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .carousel-dots .dot.active {
      width: 18px;
      background: #ffffff;
    }

    .gallery-thumbs {
      display: flex;
      gap: 8px;
      padding: 12px 12px 0;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .gallery-thumbs::-webkit-scrollbar {
      display: none;
    }

    .thumb {
      appearance: none;
      border: 1px solid transparent;
      background: transparent;
      flex-shrink: 0;
      width: 80px;
      height: 60px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .thumb.active {
      border-color: #1f3a5f;
      transform: translateY(-2px);
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
      background: rgba(15, 23, 42, 0.78);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      border: 0;
      z-index: 3;
    }

    .hero-summary {
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .car-title {
      margin: 0;
      font-size: clamp(26px, 5vw, 36px);
      line-height: 1;
      color: #0f172a;
      font-weight: 700;
    }

    .hero-kicker {
      display: inline-flex;
      width: fit-content;
      padding: 6px 10px;
      border-radius: 999px;
      background: #eef2f7;
      color: #475569;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .hero-subtitle {
      margin: 8px 0 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.5;
    }

    .hero-price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .price {
      font-size: clamp(30px, 6vw, 42px);
      font-weight: 700;
      color: #0f172a;
    }

    .price-note {
      margin-top: 4px;
      font-size: 13px;
      color: #64748b;
    }

    .condition-badge {
      font-size: 12px;
      padding: 4px 12px;
      text-transform: uppercase;
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
      font-size: 13px;
      color: #64748b;
      background: #f8fafc;
      padding: 14px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .stat-item ion-icon {
      color: #1f3a5f;
      font-size: 18px;
    }

    .stat-item strong {
      color: #0f172a;
      font-size: 14px;
    }

    .detail-card {
      padding: 20px;
    }

    .section-heading {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }

    .section-heading h2 {
      margin: 0;
      font-size: 20px;
      color: #0f172a;
    }

    .section-heading p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #64748b;
    }

    .body-copy {
      margin: 0;
      color: #475569;
      line-height: 1.7;
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
      padding: 14px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }

    .spec-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1f3a5f, #315f84);
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

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
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
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      gap: 12px;
    }

    .spec-row .spec-label {
      font-weight: 500;
      color: #7f8c8d;
    }

    .spec-row .spec-value {
      font-weight: 600;
      color: #2c3e50;
      text-align: right;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 12px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #2c3e50;
      padding: 12px 14px;
      border-radius: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .feature-item ion-icon {
      font-size: 20px;
    }

    .finance-options {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .finance-option {
      padding: 16px;
      border-radius: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .option-header,
    .option-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .option-header strong {
      color: #0f172a;
      font-size: 15px;
    }

    .option-header span,
    .option-meta span {
      color: #64748b;
      font-size: 13px;
    }

    .option-meta {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }

    .section-action {
      margin-top: 14px;
      --border-radius: 16px;
    }

    .detail-card--contact {
      padding-bottom: 8px;
    }

    .action-bar {
      position: sticky;
      bottom: 0;
      display: grid;
      grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
      gap: 12px;
      padding: 12px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(148, 163, 184, 0.14);
      box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1);
      backdrop-filter: blur(16px);
    }

    .action-bar ion-button {
      margin: 0;
      --border-radius: 16px;
      min-height: 48px;
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

    @media (max-width: 900px) {
      .detail-grid,
      .finance-options {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 720px) {
      .detail-shell {
        padding: 12px 12px calc(104px + env(safe-area-inset-bottom));
      }

      .hero-summary,
      .detail-card {
        padding: 16px;
      }

      .hero-price-row,
      .section-heading,
      .spec-row,
      .option-header,
      .option-meta {
        flex-direction: column;
        align-items: flex-start;
      }

      .spec-row .spec-value {
        text-align: left;
      }

      .quick-stats,
      .specs-grid,
      .action-bar {
        grid-template-columns: 1fr;
      }

      .gallery-thumbs {
        padding-top: 10px;
      }

      .thumb {
        width: 68px;
        height: 52px;
      }
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
        this.allImages = [car.image, ...(car.gallery || [])];
        this.currentImageIndex = 0;
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
      this.showFeedback(this.isFavorite ? 'Added to favorites' : 'Removed from favorites');
    }
  }

  async shareCar() {
    if (!this.car) {
      return;
    }

    const shareData = {
      title: this.car.name,
      text: `${this.car.year} ${this.car.brand} ${this.car.model}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        this.showFeedback('Car link copied');
      }
    } catch {
      this.showFeedback('Share cancelled', 'medium');
    }
  }

  viewImage(url: string) {
    // Build array of all images (main + gallery)
    if (!this.allImages.length && this.car) {
      this.allImages = [this.car.image, ...(this.car.gallery || [])];
    }
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

  openFinanceCalculator() {
    this.showFeedback('More financing options coming soon', 'medium');
  }

  addToCompare() {
    if (this.car) {
      const stored = localStorage.getItem('carsToCompare');
      const ids: string[] = stored ? JSON.parse(stored) : [];
      
      if (ids.includes(String(this.car.id))) {
        this.showFeedback('Car already in compare list', 'warning');
        return;
      }
      
      if (ids.length >= 2) {
        this.showFeedback('Maximum 2 cars can be compared', 'warning');
        return;
      }
      
      ids.push(String(this.car.id));
      localStorage.setItem('carsToCompare', JSON.stringify(ids));
      this.showFeedback('Added to compare');
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

  get hasKeySpecs(): boolean {
    if (!this.car) return false;
    return !!(
      this.car.horsepower ||
      this.car.mpgCombined ||
      this.car.seats ||
      this.car.drivetrain
    );
  }

  get overviewText(): string {
    if (!this.car) {
      return '';
    }

    return [
      `${this.car.year} ${this.car.brand} ${this.car.model} configured as a ${this.car.type.toLowerCase()}.`,
      `${this.car.transmission} transmission with ${this.car.fuelType.toLowerCase()} powertrain.`,
      `${this.car.mileage.toLocaleString()} miles on the odometer.`,
      this.car.condition ? `Condition: ${this.car.condition}.` : ''
    ]
      .filter(Boolean)
      .join(' ');
  }

  get financeOptions(): Array<{ name: string; apr: number; term: number; monthlyPayment: number }> {
    if (!this.car) {
      return [];
    }

    const base = this.car.price;
    const buildMonthly = (apr: number, term: number) =>
      Math.round((base * (1 + apr / 100 * (term / 12))) / term);

    return [
      { name: 'Standard Plan', apr: 4.9, term: 48, monthlyPayment: buildMonthly(4.9, 48) },
      { name: 'Flexible Plan', apr: 5.9, term: 60, monthlyPayment: buildMonthly(5.9, 60) },
      { name: 'Low Payment', apr: 6.9, term: 72, monthlyPayment: buildMonthly(6.9, 72) }
    ];
  }

  private showFeedback(message: string, color: string = 'success') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}

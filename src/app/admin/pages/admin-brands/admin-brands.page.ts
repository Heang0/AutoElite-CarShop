import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonList, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { FirestoreService, type Brand } from '../../../services/firestore.service';

@Component({
  selector: 'app-admin-brands',
  template: `
    <div class="brands-content">
      <header class="top-bar">
        <h2>Brands</h2>
      </header>

      <div class="content">
        <div class="brands-header">
          <h3>Car Brands</h3>
          <ion-button (click)="openBrandForm()">
            <ion-icon slot="start" name="add-outline"></ion-icon>
            Add Brand
          </ion-button>
        </div>

        <div class="brands-grid">
          <ion-card *ngFor="let brand of brands" class="brand-card">
            <ion-card-content>
              <div class="brand-header">
                <h4>{{ brand.name }}</h4>
                <div class="brand-actions">
                  <ion-button fill="clear" size="small" (click)="openBrandForm(brand)">
                    <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" size="small" color="danger" (click)="deleteBrand(brand)">
                    <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                  </ion-button>
                </div>
              </div>
              <p class="brand-desc">{{ brand.description || 'No description' }}</p>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </div>

    <!-- Brand Form Modal -->
    <ion-modal [isOpen]="showBrandForm" (didDismiss)="closeBrandForm()">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button (click)="closeBrandForm()">
                <ion-icon slot="icon-only" name="close-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-title>{{ selectedBrand ? 'Edit Brand' : 'Add Brand' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="saveBrand()" [disabled]="brandForm.invalid">
                <ion-icon slot="icon-only" name="checkmark-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="form-content">
          <form [formGroup]="brandForm">
            <ion-list>
              <ion-input
                label="Brand Name"
                labelPlacement="stacked"
                formControlName="name"
                placeholder="e.g., Toyota"
              ></ion-input>

              <ion-input
                label="Description"
                labelPlacement="stacked"
                formControlName="description"
                placeholder="e.g., Japanese automotive manufacturer"
              ></ion-input>

              <ion-input
                label="Logo URL (optional)"
                labelPlacement="stacked"
                formControlName="logoUrl"
                placeholder="https://example.com/logo.png"
              ></ion-input>
            </ion-list>
          </form>
        </ion-content>
      </ng-template>
    </ion-modal>

    <!-- Toast Notification -->
    <ion-toast
      [isOpen]="showToast"
      [message]="toastMessage"
      [duration]="2000"
      [color]="toastColor"
      position="top"
      (didDismiss)="showToast = false"
    ></ion-toast>
  `,
  styles: [`
    .brands-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .top-bar {
      background: white;
      padding: 20px 36px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    .top-bar h2 {
      margin: 0;
      font-size: 26px;
      color: #2c3e50;
      font-weight: 600;
    }

    .content {
      flex: 1;
      padding: 32px 36px;
    }

    .brands-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e8ecf1;
    }

    .brands-header h3 {
      margin: 0;
      font-size: 22px;
      color: #2c3e50;
      font-weight: 600;
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .brand-card {
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      margin: 0;
      background: white;
    }

    .brand-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .brand-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8ecf1;
    }

    .brand-header h4 {
      margin: 0;
      font-size: 18px;
      color: #2c3e50;
      font-weight: 600;
    }

    .brand-desc {
      margin: 0;
      font-size: 14px;
      color: #7f8c8d;
    }

    .form-content {
      --background: white;
    }

    ion-list {
      background: transparent;
      padding: 24px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonInput,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonToast
  ]
})
export class AdminBrandsPage implements OnInit {
  brands: Brand[] = [];
  selectedBrand: Brand | null = null;
  showBrandForm = false;
  brandForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private firestoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, closeOutline, checkmarkOutline });
    
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      logoUrl: ['']
    });
  }

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.firestoreService.getBrands().then(brands => {
      this.brands = brands;
      if (brands.length === 0) {
        this.createDefaultBrands();
      }
    });
  }

  async createDefaultBrands() {
    const defaults = [
      { name: 'Toyota', description: 'Japanese automotive manufacturer' },
      { name: 'Honda', description: 'Japanese multinational corporation' },
      { name: 'Ford', description: 'American automobile manufacturer' },
      { name: 'BMW', description: 'German luxury vehicle manufacturer' },
      { name: 'Mercedes-Benz', description: 'German luxury automotive brand' },
      { name: 'Audi', description: 'German luxury automotive manufacturer' },
      { name: 'Tesla', description: 'American electric vehicle manufacturer' },
      { name: 'Nissan', description: 'Japanese multinational automobile manufacturer' }
    ];

    for (const brand of defaults) {
      await this.firestoreService.addBrand(brand.name, '', brand.description);
    }
    this.loadBrands();
  }

  openBrandForm(brand?: Brand) {
    if (brand) {
      this.selectedBrand = brand;
      this.brandForm.patchValue({
        name: brand.name,
        description: brand.description || '',
        logoUrl: brand.logoUrl || ''
      });
    } else {
      this.selectedBrand = null;
      this.brandForm.reset({ name: '', description: '', logoUrl: '' });
    }
    this.showBrandForm = true;
  }

  closeBrandForm() {
    this.showBrandForm = false;
    this.selectedBrand = null;
    this.brandForm.reset();
  }

  saveBrand() {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    const { name, description, logoUrl } = this.brandForm.value;

    if (this.selectedBrand) {
      this.firestoreService.updateBrand(this.selectedBrand.id, name, logoUrl, description)
        .then(() => {
          this.toastMessage = 'Brand updated! ✓';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeBrandForm();
          this.loadBrands();
        })
        .catch(err => {
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    } else {
      this.firestoreService.addBrand(name, logoUrl, description)
        .then(() => {
          this.toastMessage = 'Brand added! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeBrandForm();
          this.loadBrands();
        })
        .catch(err => {
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    }
  }

  deleteBrand(brand: Brand) {
    if (!confirm(`Delete "${brand.name}"?`)) {
      return;
    }

    this.firestoreService.deleteBrand(brand.id)
      .then(() => {
        this.toastMessage = 'Brand deleted!';
        this.toastColor = 'success';
        this.showToast = true;
        this.loadBrands();
      })
      .catch(err => {
        this.toastMessage = 'Failed: ' + err.message;
        this.toastColor = 'danger';
        this.showToast = true;
      });
  }
}

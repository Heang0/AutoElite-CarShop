import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption,
  IonToast, IonImg, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, checkmarkCircleOutline, imagesOutline, closeCircleOutline } from 'ionicons/icons';
import { CarApiService } from '../../../services/car-api.service';
import { FirestoreService, type Category, type Brand } from '../../../services/firestore.service';
import { CloudinaryService } from '../../../services/cloudinary.service';
import type { Car } from '../../../services/favorite.service';

@Component({
  selector: 'app-admin-add-car',
  template: `
    <div class="add-car-content">
      <header class="top-bar">
        <h2>{{ isEditMode ? 'Edit Car' : 'Add Car' }}</h2>
      </header>

      <div class="scroll-content">
        <div class="form-container">
          <form [formGroup]="carForm">
            <div class="form-grid">
              <ion-input
                label="Name"
                labelPlacement="stacked"
                formControlName="name"
                placeholder="e.g., BMW M5 Competition"
              ></ion-input>

              <ion-select
                label="Brand"
                labelPlacement="stacked"
                formControlName="brandId"
                placeholder="Select brand"
              >
                <ion-select-option *ngFor="let brand of brands" [value]="brand.id">{{ brand.name }}</ion-select-option>
              </ion-select>

              <ion-input
                label="Model"
                labelPlacement="stacked"
                formControlName="model"
                placeholder="e.g., M5 Competition"
              ></ion-input>

              <ion-input
                label="Year"
                type="number"
                labelPlacement="stacked"
                formControlName="year"
              ></ion-input>

              <ion-input
                label="Price ($)"
                type="number"
                labelPlacement="stacked"
                formControlName="price"
              ></ion-input>

              <ion-input
                label="Mileage (km)"
                type="number"
                labelPlacement="stacked"
                formControlName="mileage"
              ></ion-input>

              <ion-select
                label="Fuel Type"
                labelPlacement="stacked"
                formControlName="fuelType"
                placeholder="Select fuel type"
              >
                <ion-select-option *ngFor="let fuel of FUEL_TYPES" [value]="fuel">{{ fuel }}</ion-select-option>
              </ion-select>

              <ion-select
                label="Transmission"
                labelPlacement="stacked"
                formControlName="transmission"
                placeholder="Select transmission"
              >
                <ion-select-option *ngFor="let trans of TRANSMISSIONS" [value]="trans">{{ trans }}</ion-select-option>
              </ion-select>

              <ion-select
                label="Category"
                labelPlacement="stacked"
                formControlName="categoryId"
                placeholder="Select category"
              >
                <ion-select-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</ion-select-option>
              </ion-select>

              <ion-input
                label="Rating (1-5)"
                type="number"
                labelPlacement="stacked"
                formControlName="rating"
                min="1"
                max="5"
              ></ion-input>

              <ion-input
                label="Image URL"
                labelPlacement="stacked"
                formControlName="image"
                placeholder="https://example.com/image.jpg or upload below"
              ></ion-input>

              <!-- Image Upload -->
              <div class="image-upload-section">
                <label class="upload-label">
                  <ion-icon name="cloud-upload-outline"></ion-icon>
                  <span>Upload Main Image</span>
                  <input type="file" accept="image/*" (change)="onImageSelected($event)" [disabled]="isUploadingImage" />
                </label>
                <ion-spinner *ngIf="isUploadingImage" name="crescent"></ion-spinner>
              </div>

              <!-- Gallery Upload -->
              <div class="gallery-upload-section">
                <h4>Gallery Images (Optional, max 4)</h4>
                <label class="upload-label gallery-label">
                  <ion-icon name="images-outline"></ion-icon>
                  <span>Upload Gallery Images</span>
                  <input type="file" accept="image/*" multiple (change)="onGallerySelected($event)" [disabled]="isUploadingGallery" />
                </label>
                <ion-spinner *ngIf="isUploadingGallery" name="crescent"></ion-spinner>
                
                <div class="gallery-preview" *ngIf="galleryImages.length > 0">
                  <div class="gallery-item" *ngFor="let img of galleryImages; let i = index">
                    <ion-img [src]="img" alt="Gallery"></ion-img>
                    <button class="remove-gallery" (click)="removeGalleryImage(i)">
                      <ion-icon name="close-circle"></ion-icon>
                    </button>
                  </div>
                </div>
              </div>

              <ion-input
                label="Features (comma separated)"
                labelPlacement="stacked"
                formControlName="features"
                placeholder="Leather Seats, Sunroof, Navigation"
              ></ion-input>

              <!-- Additional Details Section -->
              <div class="additional-details-section">
                <h3>Additional Details</h3>
                <div class="form-grid">
                  <ion-input
                    label="Exterior Color"
                    labelPlacement="stacked"
                    formControlName="exteriorColor"
                    placeholder="e.g., Classic Silver Metallic"
                  ></ion-input>

                  <ion-input
                    label="Interior Color"
                    labelPlacement="stacked"
                    formControlName="interiorColor"
                    placeholder="e.g., Black Cloth"
                  ></ion-input>

                  <ion-input
                    label="Drivetrain"
                    labelPlacement="stacked"
                    formControlName="drivetrain"
                    placeholder="e.g., Front Wheel Drive"
                  ></ion-input>

                  <ion-input
                    label="Horsepower"
                    type="number"
                    labelPlacement="stacked"
                    formControlName="horsepower"
                    placeholder="e.g., 169"
                  ></ion-input>

                  <ion-input
                    label="Seats"
                    type="number"
                    labelPlacement="stacked"
                    formControlName="seats"
                    placeholder="5"
                  ></ion-input>

                  <ion-input
                    label="VIN (optional)"
                    labelPlacement="stacked"
                    formControlName="vin"
                    placeholder="Vehicle Identification Number"
                  ></ion-input>

                  <ion-input
                    label="Stock # (optional)"
                    labelPlacement="stacked"
                    formControlName="stockNumber"
                    placeholder="Stock number"
                  ></ion-input>

                  <ion-select
                    label="Condition"
                    labelPlacement="stacked"
                    formControlName="condition"
                    placeholder="Select condition"
                  >
                    <ion-select-option value="New">New</ion-select-option>
                    <ion-select-option value="Used">Used</ion-select-option>
                    <ion-select-option value="Certified Pre-Owned">Certified Pre-Owned</ion-select-option>
                  </ion-select>
                </div>
              </div>
            </div>

            <!-- Image Preview -->
            <div *ngIf="carForm.get('image')?.value" class="image-preview-wrapper">
              <h4>Main Image Preview:</h4>
              <div class="image-preview">
                <ion-img [src]="carForm.get('image')?.value" alt="Preview"></ion-img>
              </div>
            </div>

            <!-- Gallery Preview -->
            <div *ngIf="galleryImages.length > 0" class="gallery-preview-wrapper">
              <h4>Gallery Images ({{ galleryImages.length }}):</h4>
              <div class="gallery-preview-grid">
                <div class="gallery-item" *ngFor="let img of galleryImages; let i = index">
                  <ion-img [src]="img" alt="Gallery {{ i + 1 }}"></ion-img>
                  <button class="remove-gallery" (click)="removeGalleryImage(i)">
                    <ion-icon name="close-circle"></ion-icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions-wrapper">
              <div class="form-actions">
                <ion-button fill="outline" (click)="resetForm()">Reset</ion-button>
                <ion-button type="button" (click)="saveCar()" [disabled]="carForm.invalid">{{ isEditMode ? 'Update Car' : 'Add Car' }}</ion-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

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
    .add-car-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .top-bar {
      background: white;
      padding: 20px 36px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      flex-shrink: 0;
    }

    .top-bar h2 {
      margin: 0;
      font-size: 26px;
      color: #2c3e50;
      font-weight: 600;
    }

    .scroll-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px 36px;
    }

    .form-container {
      background: white;
      border-radius: 16px;
      padding: 36px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 28px;
    }

    .form-grid ion-input,
    .form-grid ion-select {
      --background: #f8f9fa;
      --border-radius: 10px;
    }

    .image-upload-section {
      grid-column: 1 / -1;
      padding: 24px;
      background: #f8f9fa;
      border-radius: 12px;
      text-align: center;
    }

    .upload-label {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 32px;
      border: 2px dashed #3498db;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .upload-label:hover {
      background: rgba(52, 152, 219, 0.08);
    }

    .upload-label ion-icon {
      font-size: 40px;
      color: #3498db;
    }

    .upload-label span {
      font-size: 15px;
      color: #2c3e50;
    }

    .upload-label input[type="file"] {
      display: none;
    }

    .image-preview {
      margin: 0;
      border-radius: 12px;
      overflow: hidden;
      max-width: 500px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .image-preview ion-img {
      width: 100%;
      max-height: 350px;
      object-fit: cover;
    }

    .image-preview-wrapper,
    .gallery-preview-wrapper {
      margin: 24px 0;
      padding: 24px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .image-preview-wrapper h4,
    .gallery-preview-wrapper h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #2c3e50;
      font-weight: 600;
    }

    .gallery-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
    }

    .image-preview-wrapper {
      grid-column: 1 / -1;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e8ecf1;
    }

    .image-preview-wrapper h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #2c3e50;
      font-weight: 600;
    }

    .form-actions-wrapper {
      grid-column: 1 / -1;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e8ecf1;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .form-actions ion-button {
      --padding-start: 32px;
      --padding-end: 32px;
    }

    .gallery-upload-section h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #2c3e50;
      font-weight: 600;
    }

    .gallery-label {
      border-color: #27ae60;
    }

    .gallery-label:hover {
      background: rgba(39, 174, 96, 0.08);
    }

    .gallery-label ion-icon {
      color: #27ae60;
    }

    .additional-details-section {
      grid-column: 1 / -1;
      margin-top: 24px;
      padding: 24px;
      background: linear-gradient(135deg, #f8f9fa, #e8ecf1);
      border-radius: 12px;
      border: 1px solid #dee2e6;
    }

    .additional-details-section h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      color: #2c3e50;
      font-weight: 600;
      padding-bottom: 12px;
      border-bottom: 2px solid #3498db;
    }

    .gallery-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }

    .gallery-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 1;
    }

    .gallery-item ion-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-gallery {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-gallery ion-icon {
      font-size: 18px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid #e8ecf1;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToast,
    IonImg,
    IonSpinner
  ]
})
export class AdminAddCarPage implements OnInit {
  carForm: FormGroup;
  brands: Brand[] = [];
  categories: Category[] = [];
  isUploadingImage = false;
  isUploadingGallery = false;
  galleryImages: string[] = [];
  showToast = false;
  toastMessage = '';
  toastColor = 'success';
  isEditMode = false;

  FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
  TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];

  private carApi = inject(CarApiService);
  private firestoreService = inject(FirestoreService);
  private cloudinaryService = inject(CloudinaryService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    addIcons({ cloudUploadOutline, checkmarkCircleOutline, imagesOutline, closeCircleOutline });

    this.carForm = this.fb.group({
      name: ['', Validators.required],
      brandId: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      fuelType: ['Gasoline', Validators.required],
      transmission: ['Automatic', Validators.required],
      rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      image: ['', Validators.required],
      features: [''],
      categoryId: ['', Validators.required],
      // Additional details
      exteriorColor: [''],
      interiorColor: [''],
      drivetrain: [''],
      horsepower: [0],
      seats: [5],
      vin: [''],
      stockNumber: [''],
      condition: ['Used'],
      bodyStyle: [''],
      doors: [4]
    });
  }

  ngOnInit() {
    this.loadBrands();
    this.loadCategories();
    
    // Check if we're editing an existing car
    this.route.queryParams.subscribe(params => {
      if (params['editId']) {
        this.loadCarForEdit(params['editId']);
      }
    });
  }

  loadCarForEdit(carId: string) {
    this.isEditMode = true;
    this.carApi.getCarById(carId).subscribe({
      next: (car) => {
        if (car) {
          // Populate form with car data
          this.carForm.patchValue({
            name: car.name,
            brandId: car.brand,
            model: car.model,
            year: car.year,
            price: car.price,
            mileage: car.mileage,
            fuelType: car.fuelType,
            transmission: car.transmission,
            rating: car.rating,
            image: car.image,
            features: Array.isArray(car.features) ? car.features.join(', ') : car.features,
            categoryId: car.type,
            exteriorColor: car.exteriorColor,
            interiorColor: car.interiorColor,
            drivetrain: car.drivetrain,
            horsepower: car.horsepower,
            seats: car.seats,
            vin: car.vin,
            stockNumber: car.stockNumber,
            condition: car.condition || 'Used',
            bodyStyle: car.bodyStyle,
            doors: car.doors || 4
          });
          
          // Set gallery images if available
          if (car.gallery && car.gallery.length > 0) {
            this.galleryImages = car.gallery;
          }
          
          this.toastMessage = 'Editing: ' + car.name;
          this.toastColor = 'primary';
          this.showToast = true;
        }
      },
      error: (err) => {
        this.toastMessage = 'Failed to load car: ' + err.message;
        this.toastColor = 'danger';
        this.showToast = true;
      }
    });
  }

  loadBrands() {
    this.firestoreService.getBrands().then(brands => {
      this.brands = brands;
    });
  }

  loadCategories() {
    this.firestoreService.getCategories().then(categories => {
      this.categories = categories;
    });
  }

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastMessage = 'Please select an image file';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastMessage = 'Image size must be less than 5MB';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }

    this.isUploadingImage = true;

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      this.carForm.patchValue({ image: result.url });
      this.toastMessage = 'Image uploaded successfully!';
      this.toastColor = 'success';
      this.showToast = true;
    } catch (error: any) {
      this.toastMessage = 'Upload failed: ' + error.message;
      this.toastColor = 'danger';
      this.showToast = true;
    } finally {
      this.isUploadingImage = false;
    }
  }

  saveCar() {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      this.toastMessage = 'Please fill in all required fields';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }

    const formValue = this.carForm.value;
    const selectedCat = this.categories.find(c => c.id === formValue.categoryId);
    const selectedBrand = this.brands.find(b => b.id === formValue.brandId);

    const carData: Omit<Car, 'id'> = {
      name: formValue.name,
      brand: selectedBrand?.name || 'Other',
      model: formValue.model,
      year: formValue.year,
      price: formValue.price,
      mileage: formValue.mileage,
      fuelType: formValue.fuelType,
      transmission: formValue.transmission,
      rating: formValue.rating,
      image: formValue.image,
      gallery: this.galleryImages.length > 0 ? this.galleryImages : [],
      features: formValue.features.split(',').map((f: string) => f.trim()).filter((f: string) => f),
      type: selectedCat?.name || 'Other',
      isFavorite: false,
      exteriorColor: formValue.exteriorColor || '',
      interiorColor: formValue.interiorColor || '',
      drivetrain: formValue.drivetrain || '',
      horsepower: formValue.horsepower || 0,
      seats: formValue.seats || 5,
      vin: formValue.vin || '',
      stockNumber: formValue.stockNumber || '',
      condition: formValue.condition || 'Used',
      bodyStyle: formValue.bodyStyle || '',
      doors: formValue.doors || 4
    };

    // Check if we're editing an existing car
    const editId = this.route.snapshot.queryParamMap.get('editId');
    
    if (editId) {
      // Update existing car
      this.carApi.updateCar(editId, carData).subscribe({
        next: () => {
          this.toastMessage = 'Car updated successfully! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          setTimeout(() => {
            this.router.navigate(['/admin/cars']);
          }, 1500);
        },
        error: (err) => {
          this.toastMessage = 'Failed to update car: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        }
      });
    } else {
      // Add new car
      this.carApi.addCar(carData).subscribe({
        next: () => {
          this.toastMessage = 'Car added successfully! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          this.resetForm();
        },
        error: (err) => {
          this.toastMessage = 'Failed to add car: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        }
      });
    }
  }

  resetForm() {
    this.carForm.reset({
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      rating: 4,
      image: '',
      features: '',
      brandId: '',
      categoryId: ''
    });
    this.galleryImages = [];
  }

  async onGallerySelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 4 - this.galleryImages.length;
    if (remainingSlots <= 0) {
      this.toastMessage = 'Maximum 4 gallery images allowed';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }

    this.isUploadingGallery = true;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        this.toastMessage = 'Please select image files only';
        this.toastColor = 'danger';
        this.showToast = true;
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toastMessage = `Image is larger than 5MB`;
        this.toastColor = 'danger';
        this.showToast = true;
        continue;
      }

      try {
        const result = await this.cloudinaryService.uploadImage(file);
        this.galleryImages.push(result.url);
      } catch (error: any) {
        this.toastMessage = 'Failed to upload: ' + error.message;
        this.toastColor = 'danger';
        this.showToast = true;
      }
    }

    this.isUploadingGallery = false;
  }

  removeGalleryImage(index: number) {
    this.galleryImages.splice(index, 1);
  }
}

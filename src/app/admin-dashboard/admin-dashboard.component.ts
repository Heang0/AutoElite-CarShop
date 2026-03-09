import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonCard, IonCardContent, IonList, IonInput, IonSelect, IonSelectOption, IonAlert, IonSpinner, IonAvatar, IonImg, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carOutline, addOutline, createOutline, trashOutline, logOutOutline, homeOutline, settingsOutline, speedometerOutline, peopleOutline, cartOutline, calendarOutline, cashOutline, trendingUpOutline, pricetagOutline, closeOutline, checkmarkOutline, cloudUploadOutline, layersOutline, businessOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { CarApiService } from '../services/car-api.service';
import { FirestoreService, type Category, type Brand } from '../services/firestore.service';
import { CloudinaryService, type UploadResult } from '../services/cloudinary.service';
import { environment } from '../../environments/environment';
import type { Car } from '../services/favorite.service';

interface CarForm {
  name: string;
  brandId: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  rating: number;
  image: string;
  features: string;
  categoryId: string;
}

interface BrandForm {
  name: string;
  description: string;
  logoUrl: string;
}

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonList,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonAlert,
    IonSpinner,
    IonAvatar,
    IonImg,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonToast
  ]
})
export class AdminDashboardComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  isLoading = false;
  error = '';
  searchQuery = '';
  adminEmail = '';

  showForm = false;
  editingCar: Car | null = null;
  carForm: FormGroup;

  showAlert = false;
  alertMessage = '';
  alertButtons: string[] = ['OK'];

  // Toast for success/error messages
  showToast = false;
  toastMessage = '';
  toastDuration = 2000;
  toastColor = 'success';

  showStats = true;
  showCategories = false;
  showBrands = false;

  categories: Category[] = [];
  brands: Brand[] = [];
  selectedCategory: Category | null = null;
  selectedBrand: Brand | null = null;
  showCategoryForm = false;
  showBrandForm = false;
  categoryForm: FormGroup;
  brandForm: FormGroup;

  // Image upload
  isUploadingImage = false;
  uploadedImageUrl = '';

  FUEL_TYPES = FUEL_TYPES;
  TRANSMISSIONS = TRANSMISSIONS;

  private carApi = inject(CarApiService);
  private firestoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cloudinaryService = inject(CloudinaryService);

  constructor() {
    addIcons({
      carOutline,
      addOutline,
      createOutline,
      trashOutline,
      logOutOutline,
      homeOutline,
      settingsOutline,
      speedometerOutline,
      peopleOutline,
      cartOutline,
      calendarOutline,
      cashOutline,
      trendingUpOutline,
      pricetagOutline,
      closeOutline,
      checkmarkOutline,
      cloudUploadOutline,
      layersOutline,
      businessOutline,
      checkmarkCircleOutline,
      alertCircleOutline
    });

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
      categoryId: ['', Validators.required]
    });

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      logoUrl: ['']
    });
  }

  ngOnInit() {
    this.checkAuth();
  }

  checkAuth() {
    this.firestoreService.onAuthStateChanged((user) => {
      if (!user) {
        // Not logged in, redirect to login page
        this.router.navigate(['/admin-login']);
      } else {
        this.adminEmail = user.email || '';
        this.loadCategories();
        this.loadBrands();
        this.loadCars();
      }
    });
  }

  loadCategories() {
    console.log('Loading categories...');
    this.firestoreService.getCategories().then(categories => {
      console.log('Categories loaded:', categories);
      this.categories = categories;
      console.log('Categories array after assignment:', this.categories);
      // If no categories, create default ones
      if (categories.length === 0) {
        console.log('No categories found, creating defaults...');
        this.createDefaultCategories();
      }
    }).catch(err => {
      console.error('Error loading categories:', err);
    });
  }

  async createDefaultCategories() {
    const defaults = [
      { name: 'Sedan', description: '4-door passenger car' },
      { name: 'SUV', description: 'Sport Utility Vehicle' },
      { name: 'Hatchback', description: 'Compact car with rear door' },
      { name: 'Pickup', description: 'Truck with open cargo bed' },
      { name: 'Coupe', description: '2-door sports car' },
      { name: 'Van', description: 'Large passenger/cargo vehicle' },
      { name: 'Convertible', description: 'Car with retractable roof' },
      { name: 'Wagon', description: 'Station wagon' }
    ];
    
    for (const cat of defaults) {
      await this.firestoreService.addCategory(cat.name, cat.description);
    }
    this.loadCategories();
  }

  loadCars() {
    console.log('Loading cars...');
    this.isLoading = true;
    this.error = '';

    this.carApi.getCars().subscribe({
      next: (cars) => {
        console.log('Cars loaded:', cars.length);
        this.cars = cars;
        this.filteredCars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.error = 'Failed to load cars. Please check your Firebase configuration.';
        this.isLoading = false;
      }
    });
  }

  onSearch(event: any) {
    this.searchQuery = event?.detail?.value ?? '';
    if (!this.searchQuery) {
      this.filteredCars = [...this.cars];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCars = this.cars.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query)
      );
    }
  }

  openForm(car?: Car) {
    console.log('openForm called');
    console.log('Current brands:', this.brands);
    console.log('Current categories:', this.categories);
    
    if (car) {
      this.editingCar = car;
      // Find brand ID from brand name
      const selectedBrand = this.brands.find(b => b.name === car.brand);
      // Find category ID from type name
      const selectedCategory = this.categories.find(c => c.name === car.type);

      this.carForm.patchValue({
        name: car.name,
        brandId: selectedBrand?.id || '',
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        rating: car.rating,
        image: car.image,
        features: car.features.join(', '),
        categoryId: selectedCategory?.id || ''
      });
    } else {
      this.editingCar = null;
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
    }
    this.showForm = true;
    this.showStats = false;
  }

  closeForm() {
    this.showForm = false;
    this.editingCar = null;
    this.carForm.reset();
  }

  saveCar() {
    console.log('saveCar called');
    console.log('Form valid:', this.carForm.valid);
    console.log('Form value:', this.carForm.value);

    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      console.log('Form is invalid');
      this.toastMessage = 'Please fill in all required fields';
      this.toastColor = 'danger';
      this.showToast = true;
      return;
    }

    const formValue = this.carForm.value as CarForm;

    // Get category name from selected ID
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
      features: formValue.features.split(',').map((f) => f.trim()).filter((f) => f),
      type: selectedCat?.name || 'Other',
      isFavorite: false
    };

    console.log('Car data to save:', carData);

    if (this.editingCar) {
      console.log('Updating car with ID:', this.editingCar.id);
      this.carApi.updateCar(String(this.editingCar.id), carData).subscribe({
        next: () => {
          console.log('Car updated successfully');
          this.toastMessage = 'Car updated successfully!';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeForm();
          this.loadCars();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.toastMessage = 'Failed to update car: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        }
      });
    } else {
      console.log('Adding new car');
      this.carApi.addCar(carData).subscribe({
        next: () => {
          console.log('Car added successfully');
          this.toastMessage = 'Car added successfully! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeForm();
          this.loadCars();
        },
        error: (err) => {
          console.error('Add error:', err);
          this.toastMessage = 'Failed to add car: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        }
      });
    }
  }

  deleteCar(car: Car) {
    if (!confirm(`Are you sure you want to delete "${car.name}"?`)) {
      return;
    }

    this.carApi.deleteCar(String(car.id)).subscribe({
      next: () => {
        this.alertMessage = 'Car deleted successfully!';
        this.showAlert = true;
        this.loadCars();
      },
      error: (err) => {
        this.alertMessage = 'Failed to delete car: ' + err.message;
        this.showAlert = true;
      }
    });
  }

  async logout() {
    await this.firestoreService.signOut();
    this.router.navigate(['/admin']);
  }

  showDashboard() {
    this.showStats = true;
    this.showForm = false;
  }

  get totalCars() {
    return this.cars.length;
  }

  get totalValue() {
    return this.cars.reduce((sum, car) => sum + car.price, 0);
  }

  get avgPrice() {
    return this.cars.length ? this.totalValue / this.cars.length : 0;
  }

  get formControls() {
    return this.carForm.controls;
  }

  // ========== CATEGORY MANAGEMENT ==========

  showCategoryManager() {
    this.showStats = false;
    this.showForm = false;
    this.showCategories = true;
  }

  openCategoryForm(category?: Category) {
    if (category) {
      this.selectedCategory = category;
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description || ''
      });
    } else {
      this.selectedCategory = null;
      this.categoryForm.reset({ name: '', description: '' });
    }
    this.showCategoryForm = true;
  }

  closeCategoryForm() {
    this.showCategoryForm = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
  }

  saveCategory() {
    console.log('saveCategory called');
    console.log('Form valid:', this.categoryForm.valid);
    console.log('Form value:', this.categoryForm.value);
    console.log('selectedCategory:', this.selectedCategory);

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    const { name, description } = this.categoryForm.value;
    console.log('Saving category:', { name, description });

    if (this.selectedCategory) {
      console.log('Updating category with ID:', this.selectedCategory.id);
      this.firestoreService.updateCategory(this.selectedCategory.id, name, description)
        .then(() => {
          console.log('Category updated successfully');
          this.toastMessage = 'Category updated! ✓';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeCategoryForm();
          this.loadCategories();
        })
        .catch(err => {
          console.error('Update category error:', err);
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    } else {
      console.log('Adding new category');
      this.firestoreService.addCategory(name, description)
        .then((id) => {
          console.log('Category added successfully with ID:', id);
          this.toastMessage = 'Category added! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeCategoryForm();
          this.loadCategories();
        })
        .catch(err => {
          console.error('Add category error:', err);
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    }
  }

  deleteCategory(category: Category) {
    if (!confirm(`Delete "${category.name}"? Cars using this category will be affected.`)) {
      return;
    }

    this.firestoreService.deleteCategory(category.id)
      .then(() => {
        this.alertMessage = 'Category deleted!';
        this.showAlert = true;
        this.loadCategories();
      })
      .catch(err => {
        this.alertMessage = 'Failed: ' + err.message;
        this.showAlert = true;
      });
  }

  // ========== BRAND MANAGEMENT ==========

  showBrandManager() {
    this.showStats = false;
    this.showForm = false;
    this.showCategories = false;
    this.showBrands = true;
  }

  loadBrands() {
    console.log('Loading brands...');
    this.firestoreService.getBrands().then(brands => {
      console.log('Brands loaded:', brands);
      this.brands = brands;
      console.log('Brands array after assignment:', this.brands);
      // If no brands, create default ones
      if (brands.length === 0) {
        console.log('No brands found, creating defaults...');
        this.createDefaultBrands();
      }
    }).catch(err => {
      console.error('Error loading brands:', err);
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
    console.log('saveBrand called');
    console.log('Form valid:', this.brandForm.valid);
    console.log('Form value:', this.brandForm.value);
    console.log('selectedBrand:', this.selectedBrand);

    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    const { name, description, logoUrl } = this.brandForm.value;
    console.log('Saving brand:', { name, description, logoUrl });

    if (this.selectedBrand) {
      console.log('Updating brand with ID:', this.selectedBrand.id);
      this.firestoreService.updateBrand(this.selectedBrand.id, name, logoUrl, description)
        .then(() => {
          console.log('Brand updated successfully');
          this.toastMessage = 'Brand updated! ✓';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeBrandForm();
          this.loadBrands();
        })
        .catch(err => {
          console.error('Update brand error:', err);
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    } else {
      console.log('Adding new brand');
      this.firestoreService.addBrand(name, logoUrl, description)
        .then((id) => {
          console.log('Brand added successfully with ID:', id);
          this.toastMessage = 'Brand added! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeBrandForm();
          this.loadBrands();
        })
        .catch(err => {
          console.error('Add brand error:', err);
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    }
  }

  deleteBrand(brand: Brand) {
    if (!confirm(`Delete "${brand.name}"? Cars using this brand will be affected.`)) {
      return;
    }

    this.firestoreService.deleteBrand(brand.id)
      .then(() => {
        this.alertMessage = 'Brand deleted!';
        this.showAlert = true;
        this.loadBrands();
      })
      .catch(err => {
        this.alertMessage = 'Failed: ' + err.message;
        this.showAlert = true;
      });
  }

  // ========== IMAGE UPLOAD ==========

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.alertMessage = 'Please select an image file';
      this.showAlert = true;
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.alertMessage = 'Image size must be less than 5MB';
      this.showAlert = true;
      return;
    }

    this.isUploadingImage = true;

    try {
      const result = await this.cloudinaryService.uploadImage(file);
      this.uploadedImageUrl = result.url;
      
      // Update car form with uploaded image URL
      this.carForm.patchValue({ image: result.url });
      
      this.alertMessage = 'Image uploaded successfully!';
      this.showAlert = true;
    } catch (error: any) {
      this.alertMessage = 'Upload failed: ' + error.message;
      this.showAlert = true;
    } finally {
      this.isUploadingImage = false;
    }
  }
}

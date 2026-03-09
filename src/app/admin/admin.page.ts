import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonChip,
  IonAlert,
  IonFab,
  IonFabButton,
  IonFabList,
  IonSearchbar,
  IonBadge,
  IonImg,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  trashOutline,
  createSharp,
  closeOutline,
  checkmarkOutline,
  carOutline,
  pricetagOutline,
  speedometerOutline,
  calendarOutline,
  alertCircleOutline,
  settingsOutline,
  logOutOutline,
  lockClosedOutline,
  mailOutline
} from 'ionicons/icons';
import { CarApiService } from '../services/car-api.service';
import { FirestoreService } from '../services/firestore.service';
import { environment } from '../../environments/environment';
import type { Car } from '../services/favorite.service';

interface CarForm {
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
  features: string;
  type: string;
}

const CAR_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Coupe', 'Van'];
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonChip,
    IonAlert,
    IonFab,
    IonFabButton,
    IonFabList,
    IonSearchbar,
    IonBadge,
    IonImg,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonBackButton
  ]
})
export class AdminPage implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  isLoading = false;
  error = '';
  searchQuery = '';

  // Authentication
  isAuthenticated = false;
  showLogin = true;
  adminEmail = '';
  adminPassword = '';
  loginError = '';
  isLoggingIn = false;

  showForm = false;
  editingCar: Car | null = null;
  carForm: FormGroup;

  showAlert = false;
  alertMessage = '';
  alertButtons: string[] = ['OK'];

  // Constants for dropdowns
  CAR_TYPES = CAR_TYPES;
  FUEL_TYPES = FUEL_TYPES;
  TRANSMISSIONS = TRANSMISSIONS;

  private carApi = inject(CarApiService);
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  constructor() {
    addIcons({
      addOutline,
      createOutline,
      trashOutline,
      createSharp,
      closeOutline,
      checkmarkOutline,
      carOutline,
      pricetagOutline,
      speedometerOutline,
      calendarOutline,
      alertCircleOutline,
      settingsOutline,
      logOutOutline,
      lockClosedOutline,
      mailOutline
    });

    this.carForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      fuelType: ['Gasoline', Validators.required],
      transmission: ['Automatic', Validators.required],
      rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]],
      image: ['', Validators.required],
      features: [''],
      type: ['Sedan', Validators.required]
    });
  }

  ngOnInit() {
    // Check if already authenticated with Firebase
    this.firestoreService.onAuthStateChanged((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.showLogin = false;
        this.loadCars();
      } else {
        this.isAuthenticated = false;
        this.showLogin = true;
      }
    });
  }

  async login() {
    if (!this.adminEmail || !this.adminPassword) {
      this.loginError = 'Please enter both email and password';
      return;
    }

    this.isLoggingIn = true;
    this.loginError = '';

    try {
      await this.firestoreService.signIn(this.adminEmail, this.adminPassword);
      // Redirect to admin dashboard (which is now at /admin)
      this.router.navigate(['/admin']);
    } catch (error: any) {
      this.loginError = error.message;
    } finally {
      this.isLoggingIn = false;
    }
  }

  async logout() {
    try {
      await this.firestoreService.signOut();
      this.isAuthenticated = false;
      this.showLogin = true;
      this.cars = [];
      this.filteredCars = [];
    } catch (error: any) {
      this.alertMessage = 'Failed to logout: ' + error.message;
      this.showAlert = true;
    }
  }

  loadCars() {
    this.isLoading = true;
    this.error = '';

    this.carApi.getCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.filteredCars = cars;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cars. Please check your Firebase configuration.';
        this.isLoading = false;
        console.error('Error loading cars:', err);
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
    if (car) {
      this.editingCar = car;
      this.carForm.patchValue({
        name: car.name,
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        rating: car.rating,
        image: car.image,
        features: car.features.join(', '),
        type: car.type
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
        type: 'Sedan'
      });
    }
    this.showForm = true;
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
      this.alertMessage = 'Please fill in all required fields';
      this.showAlert = true;
      return;
    }

    const formValue = this.carForm.value as CarForm;
    const carData: Omit<Car, 'id'> = {
      name: formValue.name,
      brand: formValue.brand,
      model: formValue.model,
      year: formValue.year,
      price: formValue.price,
      mileage: formValue.mileage,
      fuelType: formValue.fuelType,
      transmission: formValue.transmission,
      rating: formValue.rating,
      image: formValue.image,
      features: formValue.features.split(',').map((f) => f.trim()).filter((f) => f),
      type: formValue.type,
      isFavorite: false
    };

    console.log('Car data to save:', carData);

    if (this.editingCar) {
      console.log('Updating car with ID:', this.editingCar.id);
      this.carApi.updateCar(String(this.editingCar.id), carData).subscribe({
        next: () => {
          console.log('Car updated successfully');
          this.alertMessage = 'Car updated successfully!';
          this.showAlert = true;
          this.closeForm();
          this.loadCars();
        },
        error: (err) => {
          console.error('Update error:', err);
          this.alertMessage = 'Failed to update car: ' + err.message;
          this.showAlert = true;
        }
      });
    } else {
      console.log('Adding new car');
      this.carApi.addCar(carData).subscribe({
        next: () => {
          console.log('Car added successfully');
          this.alertMessage = 'Car added successfully!';
          this.showAlert = true;
          this.closeForm();
          this.loadCars();
        },
        error: (err) => {
          console.error('Add error:', err);
          this.alertMessage = 'Failed to add car: ' + err.message;
          this.showAlert = true;
        }
      });
    }
  }

  deleteCar(car: Car) {
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

  get formName() {
    return this.carForm.get('name');
  }

  get formBrand() {
    return this.carForm.get('brand');
  }

  get formModel() {
    return this.carForm.get('model');
  }

  get formYear() {
    return this.carForm.get('year');
  }

  get formPrice() {
    return this.carForm.get('price');
  }

  get formMileage() {
    return this.carForm.get('mileage');
  }

  get formImage() {
    return this.carForm.get('image');
  }
}

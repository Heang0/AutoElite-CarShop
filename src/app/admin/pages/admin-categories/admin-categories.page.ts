import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonList, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { FirestoreService, type Category } from '../../../services/firestore.service';

@Component({
  selector: 'app-admin-categories',
  template: `
    <div class="categories-content">
      <header class="top-bar">
        <h2>Categories</h2>
      </header>

      <div class="content">
        <div class="categories-header">
          <h3>Car Categories</h3>
          <ion-button (click)="openCategoryForm()">
            <ion-icon slot="start" name="add-outline"></ion-icon>
            Add Category
          </ion-button>
        </div>

        <div class="categories-grid">
          <ion-card *ngFor="let cat of categories" class="category-card">
            <ion-card-content>
              <div class="category-header">
                <h4>{{ cat.name }}</h4>
                <div class="category-actions">
                  <ion-button fill="clear" size="small" (click)="openCategoryForm(cat)">
                    <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" size="small" color="danger" (click)="deleteCategory(cat)">
                    <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                  </ion-button>
                </div>
              </div>
              <p class="category-desc">{{ cat.description || 'No description' }}</p>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </div>

    <!-- Category Form Modal -->
    <ion-modal [isOpen]="showCategoryForm" (didDismiss)="closeCategoryForm()">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button (click)="closeCategoryForm()">
                <ion-icon slot="icon-only" name="close-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
            <ion-title>{{ selectedCategory ? 'Edit Category' : 'Add Category' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="saveCategory()" [disabled]="categoryForm.invalid">
                <ion-icon slot="icon-only" name="checkmark-outline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="form-content">
          <form [formGroup]="categoryForm">
            <ion-list>
              <ion-input
                label="Category Name"
                labelPlacement="stacked"
                formControlName="name"
                placeholder="e.g., SUV"
              ></ion-input>

              <ion-input
                label="Description"
                labelPlacement="stacked"
                formControlName="description"
                placeholder="e.g., Sport Utility Vehicle"
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
    .categories-content {
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

    .categories-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e8ecf1;
    }

    .categories-header h3 {
      margin: 0;
      font-size: 22px;
      color: #2c3e50;
      font-weight: 600;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .category-card {
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      margin: 0;
      background: white;
    }

    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8ecf1;
    }

    .category-header h4 {
      margin: 0;
      font-size: 18px;
      color: #2c3e50;
      font-weight: 600;
    }

    .category-desc {
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
export class AdminCategoriesPage implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  showCategoryForm = false;
  categoryForm: FormGroup;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  private firestoreService = inject(FirestoreService);
  private fb = inject(FormBuilder);

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, closeOutline, checkmarkOutline });
    
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.firestoreService.getCategories().then(categories => {
      this.categories = categories;
      if (categories.length === 0) {
        this.createDefaultCategories();
      }
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
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { name, description } = this.categoryForm.value;

    if (this.selectedCategory) {
      this.firestoreService.updateCategory(this.selectedCategory.id, name, description)
        .then(() => {
          this.toastMessage = 'Category updated! ✓';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeCategoryForm();
          this.loadCategories();
        })
        .catch(err => {
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    } else {
      this.firestoreService.addCategory(name, description)
        .then(() => {
          this.toastMessage = 'Category added! 🎉';
          this.toastColor = 'success';
          this.showToast = true;
          this.closeCategoryForm();
          this.loadCategories();
        })
        .catch(err => {
          this.toastMessage = 'Failed: ' + err.message;
          this.toastColor = 'danger';
          this.showToast = true;
        });
    }
  }

  deleteCategory(category: Category) {
    if (!confirm(`Delete "${category.name}"?`)) {
      return;
    }

    this.firestoreService.deleteCategory(category.id)
      .then(() => {
        this.toastMessage = 'Category deleted!';
        this.toastColor = 'success';
        this.showToast = true;
        this.loadCategories();
      })
      .catch(err => {
        this.toastMessage = 'Failed: ' + err.message;
        this.toastColor = 'danger';
        this.showToast = true;
      });
  }
}

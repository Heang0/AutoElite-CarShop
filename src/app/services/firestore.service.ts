import { Injectable, inject } from '@angular/core';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  type Firestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import {
  getAuth,
  type Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { environment } from '../../environments/environment';
import type { Car } from './favorite.service';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  createdAt: Timestamp;
}

export interface Review {
  id: string;
  carId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  userName: string;
  userEmail: string;
  startDate: Timestamp;
  endDate: Timestamp;
  pickupLocation: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: Timestamp;
}

// Initialize Firebase
let firebaseApp: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

try {
  firebaseApp = initializeApp(environment.firebase);
  db = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  console.log('[Firestore] Firebase initialized successfully');
} catch (error: any) {
  console.error('[Firestore] Firebase initialization failed:', error?.message || error);
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private readonly carsCollection = collection(db as Firestore, 'cars');
  private readonly categoriesCollection = collection(db as Firestore, 'categories');
  private readonly brandsCollection = collection(db as Firestore, 'brands');
  private readonly reviewsCollection = collection(db as Firestore, 'reviews');
  private readonly bookingsCollection = collection(db as Firestore, 'bookings');
  private readonly usersCollection = collection(db as Firestore, 'users');

  // Auth state observer
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth as Auth, callback);
  }

  // Get current user
  getCurrentUser(): User | null {
    return (auth as Auth).currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return (auth as Auth).currentUser !== null;
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth as Auth, provider);
      return userCredential.user;
    } catch (error: any) {
      throw new Error('Google sign-in failed: ' + error.message);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth as Auth);
    } catch (error: any) {
      throw new Error('Failed to sign out: ' + error.message);
    }
  }

  // Get auth error message
  private getAuthErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'Authentication failed. Please check your credentials.';
    }
  }

  // ========== CATEGORIES ==========
  
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      if (!db) {
        console.error('[Firestore] Database not initialized');
        return [];
      }
      
      const categoriesCollection = collection(db, 'categories');
      const snapshot = await Promise.race([
        getDocs(categoriesCollection),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout after 30s')), 30000)
        )
      ]) as any;
      
      const categories = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      console.log('[Firestore] Categories fetched:', categories.length);
      return categories;
    } catch (error: any) {
      console.error('[Firestore] Error fetching categories:', error?.message || error);
      return [];
    }
  }

  // Add category
  async addCategory(name: string, description?: string): Promise<string> {
    const docRef = await addDoc(this.categoriesCollection, {
      name,
      description,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Update category
  async updateCategory(id: string, name: string, description?: string): Promise<void> {
    const docRef = doc(db as Firestore, 'categories', id);
    await updateDoc(docRef, {
      name,
      description,
      updatedAt: Timestamp.now()
    });
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    const docRef = doc(db as Firestore, 'categories', id);
    await deleteDoc(docRef);
  }

  // ========== BRANDS ==========
  
  // Get all brands
  async getBrands(): Promise<Brand[]> {
    try {
      if (!db) {
        console.error('[Firestore] Database not initialized');
        return [];
      }
      
      const brandsCollection = collection(db, 'brands');
      const snapshot = await Promise.race([
        getDocs(brandsCollection),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout after 30s')), 30000)
        )
      ]) as any;
      
      const brands = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as Brand));
      console.log('[Firestore] Brands fetched:', brands.length);
      return brands;
    } catch (error: any) {
      console.error('[Firestore] Error fetching brands:', error?.message || error);
      return [];
    }
  }

  // Add brand
  async addBrand(name: string, logoUrl?: string, description?: string): Promise<string> {
    const data: any = {
      name,
      description,
      createdAt: Timestamp.now()
    };
    // Only include logoUrl if it's provided (not undefined)
    if (logoUrl !== undefined) {
      data.logoUrl = logoUrl || null;
    }
    const docRef = await addDoc(this.brandsCollection, data);
    return docRef.id;
  }

  // Update brand
  async updateBrand(id: string, name: string, logoUrl?: string, description?: string): Promise<void> {
    const docRef = doc(db as Firestore, 'brands', id);
    await updateDoc(docRef, {
      name,
      logoUrl,
      description,
      updatedAt: Timestamp.now()
    });
  }

  // Delete brand
  async deleteBrand(id: string): Promise<void> {
    const docRef = doc(db as Firestore, 'brands', id);
    await deleteDoc(docRef);
  }

  // ========== REVIEWS ==========
  
  // Get reviews by car ID
  async getReviewsByCarId(carId: string): Promise<Review[]> {
    const q = query(this.reviewsCollection, where('carId', '==', carId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  }

  // Add review
  async addReview(carId: string, userId: string, userName: string, rating: number, comment: string): Promise<string> {
    const docRef = await addDoc(this.reviewsCollection, {
      carId,
      userId,
      userName,
      rating,
      comment,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  // ========== BOOKINGS ==========
  
  // Get bookings by user ID
  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    const q = query(this.bookingsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Booking));
  }

  // Add booking
  async addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(this.bookingsCollection, {
      ...booking,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Update booking status
  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const docRef = doc(db as Firestore, 'bookings', id);
    await updateDoc(docRef, { status });
  }

  // ========== USERS ==========
  
  // Get user by ID
  async getUser(userId: string): Promise<any> {
    const docRef = doc(db as Firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  // Create or update user profile
  async saveUserProfile(userId: string, data: any): Promise<void> {
    const docRef = doc(db as Firestore, 'users', userId);
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }

  // Get all cars
  async getCars(): Promise<Car[]> {
    try {
      console.log('[Firestore] Fetching cars...');
      
      if (!db) {
        console.error('[Firestore] Database not initialized');
        return [];
      }
      
      // Add timeout
      const carsCollection = collection(db, 'cars');
      const snapshot = await Promise.race([
        getDocs(carsCollection),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout after 30s')), 30000)
        )
      ]) as any;
      
      const cars = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as Car));
      console.log('[Firestore] Cars fetched:', cars.length);
      return cars;
    } catch (error: any) {
      console.error('[Firestore] Error fetching cars:', error?.message || error);
      return [];
    }
  }

  // Get car by ID
  async getCarById(id: string): Promise<Car | null> {
    const docRef = doc(db as Firestore, 'cars', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Car;
    }
    return null;
  }

  // Add new car
  async addCar(car: Omit<Car, 'id'>): Promise<string> {
    const docRef = await addDoc(this.carsCollection, {
      ...car,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  // Update car
  async updateCar(id: string, car: Partial<Car>): Promise<void> {
    const docRef = doc(db as Firestore, 'cars', id);
    await updateDoc(docRef, {
      ...car,
      updatedAt: Timestamp.now()
    });
  }

  // Delete car
  async deleteCar(id: string): Promise<void> {
    const docRef = doc(db as Firestore, 'cars', id);
    await deleteDoc(docRef);
  }

  // Get cars by brand
  async getCarsByBrand(brand: string): Promise<Car[]> {
    const q = query(this.carsCollection, where('brand', '==', brand));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Car));
  }

  // Get cars by type
  async getCarsByType(type: string): Promise<Car[]> {
    const q = query(this.carsCollection, where('type', '==', type));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Car));
  }

  // Get cars within price range
  async getCarsByPriceRange(minPrice: number, maxPrice: number): Promise<Car[]> {
    const q = query(
      this.carsCollection,
      where('price', '>=', minPrice),
      where('price', '<=', maxPrice)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Car));
  }
}

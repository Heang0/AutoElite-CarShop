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
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
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
  notes?: string;
  phone?: string;
  depositAmount?: number;
  depositStatus?: 'unpaid' | 'pending' | 'paid';
  bookingType?: 'test-drive' | 'purchase';
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  icon?: string;
  route?: string;
  read: boolean;
  createdAt: Timestamp;
  type?: string;
}

export interface Order {
  id: string;
  carId: string;
  carName: string;
  carImage?: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone?: string;
  address?: string;
  amount: number;
  currency: string;
  paymentMethod: 'bakong' | 'card';
  paymentReference: string;
  paymentType?: 'purchase' | 'deposit';
  bookingId?: string;
  status: 'pending' | 'paid' | 'cancelled';
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
  private readonly notificationsCollection = collection(db as Firestore, 'notifications');
  private readonly ordersCollection = collection(db as Firestore, 'orders');

  // Auth state observer
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth as Auth, callback);
  }

  // Get current user
  getCurrentUser(): User | null {
    return (auth as Auth).currentUser;
  }

  async isCurrentUserAdmin(): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }

    const profile = await this.getUserProfile(user.uid);
    return profile?.role === 'admin' || profile?.isAdmin === true;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return (auth as Auth).currentUser !== null;
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      await this.ensureUserProfile(userCredential.user, 'email');
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      if (user) {
        await this.saveUserProfile(user.uid, {
          email: user.email,
          provider: 'email',
          createdAt: Timestamp.now()
        });
      }
      
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
      const user = userCredential.user;
      
      await this.ensureUserProfile(user, 'google');
      
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

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = (auth as Auth).currentUser;
    if (!user || !user.email) {
      throw new Error('No authenticated user');
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
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

  // Update user display name
  async updateUserName(userId: string, displayName: string): Promise<void> {
    const docRef = doc(db as Firestore, 'users', userId);
    await setDoc(docRef, {
      displayName,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }

  async updateUserProfile(userId: string, data: Record<string, any>): Promise<void> {
    const docRef = doc(db as Firestore, 'users', userId);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
  }

  // Update user photo URL
  async updateUserPhoto(userId: string, photoURL: string): Promise<void> {
    const docRef = doc(db as Firestore, 'users', userId);
    await setDoc(docRef, {
      photoURL,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }

  async updateUserSettings(userId: string, settings: Record<string, any>): Promise<void> {
    const docRef = doc(db as Firestore, 'users', userId);
    await setDoc(
      docRef,
      {
        settings,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
  }

  async getUserSettings(userId: string): Promise<Record<string, any>> {
    const docRef = doc(db as Firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()?.['settings'] || {};
    }
    return {};
  }

  async savePushToken(userId: string, token: string): Promise<void> {
    const docRef = doc(db as Firestore, 'users', userId);
    await setDoc(
      docRef,
      {
        pushToken: token,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
  }

  async addNotification(notification: Omit<AppNotification, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(this.notificationsCollection, {
      ...notification,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  async getNotificationsByUserId(userId: string): Promise<AppNotification[]> {
    const q = query(
      this.notificationsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as AppNotification)
    );
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const docRef = doc(db as Firestore, 'notifications', notificationId);
    await updateDoc(docRef, { read: true });
  }

  // ========== ORDERS ==========

  async addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    const cleanOrder = Object.entries(order).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const docRef = await addDoc(this.ordersCollection, {
      ...cleanOrder,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db as Firestore, 'orders', id);
    await updateDoc(docRef, { status });
  }

  async getOrders(): Promise<Order[]> {
    const q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    } as Order));
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const q = query(
      this.ordersCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    } as Order));
  }

  // Get user profile
  async getUserProfile(userId: string): Promise<any> {
    const docRef = doc(db as Firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
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

  private async ensureUserProfile(user: User | null, provider: 'email' | 'google'): Promise<void> {
    if (!user) {
      return;
    }

    const existingProfile = await this.getUserProfile(user.uid);
    if (existingProfile) {
      await this.saveUserProfile(user.uid, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: existingProfile.provider || provider,
        lastLoginAt: Timestamp.now()
      });
      return;
    }

    await this.saveUserProfile(user.uid, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider,
      createdAt: Timestamp.now(),
      lastLoginAt: Timestamp.now()
    });
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

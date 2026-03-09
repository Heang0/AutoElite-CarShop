# Firebase Admin Panel Setup

## Overview
This project now uses **Firebase Firestore** for dynamic data management with a **password-protected admin panel**.

## Admin Panel Access

### How to Access
The admin panel is **hidden from the public app**. To access it:

1. **Run the app:**
   ```bash
   npm start
   ```

2. **Navigate directly to admin URL:**
   - Web: `http://localhost:4200/admin`
   - Mobile: Not accessible via tabs (hidden)

3. **Enter password:**
   - Default password: `admin123`
   - You can change it in `src/app/admin/admin.page.ts`

### Features
- ✅ Login protection (session-based)
- ✅ View all cars from Firebase
- ✅ Add new cars
- ✅ Edit existing cars
- ✅ Delete cars
- ✅ Search/filter cars

## Firebase Configuration

### Step 1: Update Environment Files

**For Development** (`src/environments/environment.ts`):
```typescript
firebase: {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID'
}
```

**For Production** (`src/environments/environment.prod.ts`):
```typescript
firebase: {
  // Same structure, use production Firebase config
}
```

### Step 2: Get Your Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings → Project settings
4. Scroll to "Your apps" → Firebase SDK snippet
5. Copy the config values

### Step 3: Enable Firestore Database
1. Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location closest to you

### Step 4: Add Initial Data (Optional)
You can manually add cars in Firebase Console:
- Firestore Database → Start collection
- Collection ID: `cars`
- Add documents with fields:
  - `name` (string): "BMW M5 Competition"
  - `brand` (string): "BMW"
  - `price` (number): 115900
  - `year` (number): 2023
  - `type` (string): "Sedan"
  - ...etc

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin panel (password-protected)
│   │   ├── admin.page.ts
│   │   ├── admin.page.html
│   │   └── admin.page.scss
│   ├── services/
│   │   ├── firestore.service.ts   # Firebase CRUD operations
│   │   ├── car-api.service.ts     # Car data service (uses Firestore)
│   │   └── favorite.service.ts    # Favorites management
│   └── tabs/               # Public app tabs (no admin tab)
├── environments/
│   ├── environment.ts      # Dev config (includes Firebase)
│   └── environment.prod.ts # Production config
```

## Security Notes

### Current Implementation (For Learning/Homework)
- ⚠️ Password is stored in client-side code (`admin.page.ts`)
- ⚠️ Not secure for production
- ✅ Good for learning/homework projects

### For Production (Recommended)
1. Use **Firebase Authentication** with email/password
2. Create admin roles with Firebase Custom Claims
3. Protect Firestore rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Public can read cars
       match /cars/{car} {
         allow read: if true;
         // Only admins can write
         allow write: if request.auth != null && 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

## Changing Admin Password

Edit `src/app/admin/admin.page.ts`:
```typescript
private readonly ADMIN_PASSWORD = 'your-new-password';
```

## Usage

### Add a New Car
1. Go to `/admin`
2. Login with password
3. Click the **+** (FAB button)
4. Fill in car details
5. Click ✓ to save

### Edit a Car
1. Go to `/admin`
2. Login
3. Click the ✏️ (edit) button on any car
4. Modify details
5. Click ✓ to save

### Delete a Car
1. Go to `/admin`
2. Login
3. Click the 🗑️ (delete) button on any car
4. Confirm deletion

## Build Commands

```bash
# Development
npm start

# Production build
npm run build -- --configuration production

# Run tests
npm test
```

## Firestore Data Structure

```
cars (collection)
├── {auto-generated-id} (document)
│   ├── name: "BMW M5 Competition"
│   ├── brand: "BMW"
│   ├── model: "M5 Competition"
│   ├── year: 2023
│   ├── price: 115900
│   ├── mileage: 15000
│   ├── fuelType: "Gasoline"
│   ├── transmission: "Automatic"
│   ├── rating: 5
│   ├── image: "https://..."
│   ├── features: ["Leather Seats", ...]
│   ├── type: "Sedan"
│   ├── isFavorite: false
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
└── ...
```

## Tips

1. **Session persists** - After login, you stay logged in until you logout or close browser
2. **Logout button** - Top-right corner of admin panel
3. **Back button** - Returns to home page
4. **Search** - Filter cars by name, brand, or model
5. **Image preview** - Paste image URL to see preview in form

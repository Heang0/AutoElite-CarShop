import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  logOutOutline, 
  heartOutline, 
  timeOutline, 
  calendarOutline, 
  cashOutline, 
  cameraOutline, 
  chevronForwardOutline,
  personAddOutline,
  mailOutline,
  shieldCheckmarkOutline,
  createOutline,
  closeOutline,
  carSportOutline,
  heart,
  time,
  calendar,
  swapHorizontalOutline,
  settingsOutline,
  helpCircleOutline,
  lockClosedOutline,
  fingerPrintOutline,
  logoGoogle,
  menuOutline
} from 'ionicons/icons';
import { FirestoreService } from '../services/firestore.service';
import { FavoriteService } from '../services/favorite.service';
import { CloudinaryService } from '../services/cloudinary.service';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  memberSince?: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class AccountPage implements OnInit {
  isLoggedIn = false;
  user: UserProfile | null = null;
  initials = 'U';
  savedCount = 0;
  viewedCount = 0;
  drivesCount = 0;
  showToast = false;
  toastMsg = '';
  toastColor = 'success';
  
  // Edit modal
  isEditModalOpen = false;
  isEditingName = false;
  editName = '';
  isUploadingPhoto = false;
  isLoading = true;

  private fs = inject(FirestoreService);
  private fav = inject(FavoriteService);
  private cloud = inject(CloudinaryService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);
  private menuController = inject(MenuController);

  constructor() {
    addIcons({ 
      personOutline, 
      logOutOutline, 
      heartOutline, 
      timeOutline, 
      calendarOutline, 
      cashOutline, 
      cameraOutline, 
      chevronForwardOutline,
      personAddOutline,
      mailOutline,
      shieldCheckmarkOutline,
      createOutline,
      closeOutline,
      carSportOutline,
      heart,
      time,
      calendar,
      swapHorizontalOutline,
      settingsOutline,
      helpCircleOutline,
      lockClosedOutline,
      fingerPrintOutline,
      logoGoogle,
      menuOutline
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading = true;
    (this.fs as any).onAuthStateChanged(async (authUser: any) => {
      this.isLoggedIn = !!authUser;
      
      if (authUser) {
        // Get user profile from Firestore
        const userProfile = await (this.fs as any).getUserProfile(authUser.uid);
        
        this.user = {
          uid: authUser.uid,
          email: authUser.email || userProfile?.email || '',
          displayName: userProfile?.displayName || authUser.displayName || '',
          photoURL: userProfile?.photoURL || authUser.photoURL || '',
          provider: userProfile?.provider || (authUser.providerData[0]?.providerId || 'email'),
          memberSince: userProfile?.createdAt ? 
            new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
            new Date(authUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        
        // Calculate initials
        if (this.user.displayName) {
          this.initials = this.user.displayName.charAt(0).toUpperCase();
        } else if (this.user.email) {
          this.initials = this.user.email.charAt(0).toUpperCase();
        }
        
        this.savedCount = (this.fav as any).getFavorites().length;
      } else {
        this.user = null;
      }
      
      this.isLoading = false;
    });
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  openMenu() {
    void this.menuController.open('main-menu');
  }

  async doLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Sign Out',
          role: 'destructive',
          handler: () => {
            (this.fs as any).signOut().then(() => {
              this.isLoggedIn = false;
              this.user = null;
              this.showToastMessage('Signed out successfully', 'success');
              this.router.navigate(['/auth']);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  openEditModal() {
    this.editName = this.user?.displayName || '';
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.isEditingName = false;
  }

  async uploadPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        this.showToastMessage('Image size should be less than 5MB', 'danger');
        return;
      }

      this.isUploadingPhoto = true;
      
      try {
        // Upload to Cloudinary
        const result = await (this.cloud as any).uploadImage(file);
        const imageUrl = result.url;
        
        // Save to Firestore
        if (this.user?.uid) {
          await (this.fs as any).updateUserPhoto(this.user.uid, imageUrl);
          if (this.user) {
            this.user.photoURL = imageUrl;
          }
          this.showToastMessage('Profile photo updated successfully', 'success');
        }
      } catch (error: any) {
        console.error('Upload error:', error);
        this.showToastMessage('Failed to upload image. Please try again.', 'danger');
      } finally {
        this.isUploadingPhoto = false;
      }
    };
    
    input.click();
  }

  async saveName() {
    if (!this.editName.trim()) {
      this.showToastMessage('Name cannot be empty', 'danger');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Saving...',
      duration: 2000
    });
    await loading.present();

    try {
      if (this.user?.uid) {
        await (this.fs as any).updateUserName(this.user.uid, this.editName.trim());
        if (this.user) {
          this.user.displayName = this.editName.trim();
          this.initials = this.user.displayName.charAt(0).toUpperCase();
        }
        this.showToastMessage('Name updated successfully', 'success');
        this.isEditingName = false;
      }
    } catch (error: any) {
      this.showToastMessage('Failed to update name', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  cancelEditName() {
    this.editName = this.user?.displayName || '';
    this.isEditingName = false;
  }

  getAvatarText(): string {
    if (this.user?.displayName) {
      return this.user.displayName.charAt(0).toUpperCase();
    }
    if (this.user?.email) {
      return this.user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  showToastMessage(message: string, color: string) {
    this.toastMsg = message;
    this.toastColor = color;
    this.showToast = true;
  }

  openSettings() {
    this.showToastMessage('Settings will be available soon.', 'primary');
  }

  openSupport() {
    this.showToastMessage('Support center will be available soon.', 'primary');
  }

  openPrivacy() {
    this.showToastMessage('Privacy policy will be available soon.', 'primary');
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, logOutOutline, heartOutline, timeOutline, calendarOutline, cashOutline, cameraOutline, chevronForwardOutline } from 'ionicons/icons';
import { FirestoreService } from '../services/firestore.service';
import { FavoriteService } from '../services/favorite.service';
import { CloudinaryService } from '../services/cloudinary.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AccountPage implements OnInit {
  isLoggedIn = false;
  userEmail = '';
  photoUrl = '';
  initials = 'U';
  memberSince = '';
  savedCount = 0;
  viewedCount = 0;
  drivesCount = 0;
  showToast = false;
  toastMsg = '';
  toastColor = 'success';

  private fs = inject(FirestoreService);
  private fav = inject(FavoriteService);
  private cloud = inject(CloudinaryService);
  private router = inject(Router);

  ngOnInit() {
    (this.fs as any).onAuthStateChanged((u: any) => {
      this.isLoggedIn = !!u;
      if (u) {
        this.userEmail = u.email;
        this.initials = u.email.charAt(0).toUpperCase();
        this.memberSince = new Date(u.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        this.savedCount = (this.fav as any).getFavorites().length;
        this.photoUrl = localStorage.getItem('photo_' + u.uid) || '';
      }
    });
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  doLogout() {
    (this.fs as any).signOut().then(() => {
      this.isLoggedIn = false;
      this.userEmail = '';
      this.photoUrl = '';
      this.toastMsg = 'Signed out';
      this.toastColor = 'success';
      this.showToast = true;
    });
  }

  openUpload() {
    this.toastMsg = 'Photo upload - coming soon!';
    this.toastColor = 'warning';
    this.showToast = true;
  }
}

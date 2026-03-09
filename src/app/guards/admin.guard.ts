import { inject } from '@angular/core';
import { type CanMatchFn, Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

export const adminGuard: CanMatchFn = async () => {
  const firestoreService = inject(FirestoreService);
  const router = inject(Router);

  const isAdmin = await firestoreService.isCurrentUserAdmin();
  return isAdmin ? true : router.createUrlTree(['/admin-login']);
};

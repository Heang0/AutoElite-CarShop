import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntroService {

  private readonly INTRO_COMPLETED_KEY = 'intro_completed';

  constructor() { }

  markIntroCompleted(): void {
    localStorage.setItem(this.INTRO_COMPLETED_KEY, 'true');
  }

  hasIntroBeenCompleted(): boolean {
    return localStorage.getItem(this.INTRO_COMPLETED_KEY) === 'true';
  }

  resetIntroStatus(): void {
    localStorage.removeItem(this.INTRO_COMPLETED_KEY);
  }
}
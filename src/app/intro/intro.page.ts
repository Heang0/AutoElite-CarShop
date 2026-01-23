import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  speedometerOutline,
  navigateOutline,
  checkmarkDoneOutline
} from 'ionicons/icons';

interface IntroSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  imageUrl: string;
}

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton
  ]
})
export class IntroPage implements OnInit {
  currentSlide = 0;
  slides: IntroSlide[] = [
    {
      id: 1,
      title: 'Premium Cars',
      description: 'Browse our extensive collection of premium vehicles from top manufacturers.',
      icon: 'car-sport-outline',
      backgroundColor: '#003366',
      imageUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Luxury Interiors',
      description: 'Experience premium materials and cutting-edge technology in every vehicle.',
      icon: 'speedometer-outline',
      backgroundColor: '#708090',
      imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Performance & Power',
      description: 'Discover vehicles engineered for exceptional performance and driving dynamics.',
      icon: 'navigate-outline',
      backgroundColor: '#c00000',
      imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'Ready to Explore?',
      description: 'Start your journey to find the perfect vehicle that matches your lifestyle.',
      icon: 'checkmark-done-outline',
      backgroundColor: '#003366',
      imageUrl: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    }
  ];

  constructor(
    private router: Router
  ) {
    addIcons({
      'car-sport-outline': carSportOutline,
      'speedometer-outline': speedometerOutline,
      'navigate-outline': navigateOutline,
      'checkmark-done-outline': checkmarkDoneOutline
    });
  }

  ngOnInit() {}

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.goToHome();
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  skipIntro() {
    this.router.navigate(['/home']);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
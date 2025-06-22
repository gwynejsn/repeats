import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { gsap } from 'gsap';
import { selectIsLoggedIn } from '../user/state/user.selectors';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  private store$ = inject(Store);
  isLoggedIn = false;
  constructor() {
    this.store$
      .pipe(select(selectIsLoggedIn))
      .subscribe((v) => (this.isLoggedIn = v));
  }

  handleFoodClicked() {
    return this.isLoggedIn ? ['/meals'] : ['/authentication', 'sign-in'];
  }

  healthyFoods = [
    {
      name: 'Spinach and Mushroom Omelette',
      imgSrc:
        'https://spainonafork.com/wp-content/uploads/2023/03/image3-2023-03-17T012414-11.png',
    },
    {
      name: 'Avocado Toast with Poached Egg',
      imgSrc:
        'https://hips.hearstapps.com/hmg-prod/images/air-fryer-poached-egg-avocado-toast1-1653484842.jpg?crop=0.718xw:1.00xh;0.152xw,0&resize=1200:*',
    },
    {
      name: 'Tuna and White Bean Salad ',
      imgSrc:
        'https://www.themediterraneandish.com/wp-content/uploads/2024/08/White-Bean-Tuna-Salad-11.jpg',
    },
    {
      name: 'Chickpea Curry',
      imgSrc:
        'https://hostthetoast.com/wp-content/uploads/2020/06/Chickpea-Curry-9.jpg',
    },
  ];

  ngAfterViewInit(): void {
    this.animateLeafFall();
  }

  animateLeafFall() {
    gsap.from('.leaf', {
      y: -150,
      x: 50,
      rotation: 180,
      duration: 3,
      ease: 'power1.inOut',
    });
  }
}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { selectIsLoggedIn } from '../user/state/user.selectors';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  private store$ = inject(Store);
  private platformId = inject(PLATFORM_ID);
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
    gsap.registerPlugin(ScrollTrigger);
    if (isPlatformBrowser(this.platformId)) {
      this.animateLeafFall();
      this.animateFoodImage();
      this.animatePlates();
    }
  }

  animateLeafFall() {
    gsap.from('.leaf', {
      y: -150,
      x: 50,
      rotation: 180,
      duration: 2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.hero',
        toggleActions: 'play none restart none', // on enter, on leave, on enter back, on leave back
      },
    });
  }

  animateFoodImage() {
    gsap.from('.food-image', {
      y: 600,
      ease: 'power1.out',
      duration: 0.5,
      stagger: 0.1,
    });
  }

  animatePlates() {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: '(max-width: 700px)',
        isDesktop: '(min-width: 701px)',
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions as gsap.Conditions;

        gsap.from('.feature-img-top', {
          x: isDesktop ? 0 : -200,
          y: isDesktop ? 200 : 0,
          rotation: 360,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '.features',
            start: 'top 60%',
            end: '+=400',
            scrub: true,
          },
        });

        gsap.from('.feature-img-left', {
          x: 200,
          rotation: 360,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '.features',
            start: 'top 60%',
            end: '+=400',
            scrub: true,
          },
        });

        gsap.from('.feature-img-right', {
          x: -200,
          rotation: 360,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: '.features',
            start: 'top 60%',
            end: '+=400',
            scrub: true,
          },
        });
      }
    );
  }
}

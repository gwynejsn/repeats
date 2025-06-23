import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { Gender } from '../../user/user.model';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements AfterViewInit, OnDestroy {
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  hasError = false;
  isLoading = false;
  errorMessage = '';
  genders = Object.values(Gender);
  onSignUp(inputs: {
    name: string;
    age: number;
    gender: Gender;
    email: string;
    password: string;
  }) {
    this.isLoading = true;

    this.authService
      .signUp(
        inputs.name,
        inputs.age,
        inputs.gender,
        inputs.email,
        inputs.password
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/meals']);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err;
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  private animationCtx: gsap.Context | null = null;
  @ViewChild('left') left!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.animateImg();
  }

  animateImg() {
    const leftWidth = this.left.nativeElement.offsetWidth;

    this.animationCtx = gsap.context(() => {
      gsap.from('.right', {
        x: -leftWidth,
        duration: 1,
        ease: 'power2.inOut',
      });

      gsap.from('.left', {
        x: leftWidth,
        duration: 1,
        ease: 'power2.inOut',
      });
    });
  }

  ngOnDestroy(): void {
    this.animationCtx?.revert();
  }
}

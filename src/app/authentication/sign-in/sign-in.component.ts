import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements AfterViewInit {
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  hasError = false;
  isLoading = false;
  errorMessage = '';
  onSignIn(inputs: { email: string; password: string }) {
    this.hasError = false;
    this.isLoading = true;
    this.authService.signIn(inputs.email, inputs.password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/meals']);
      },
      error: (err) => {
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage = err;
      },
    });
  }

  ngAfterViewInit(): void {
    this.animateImg();
  }

  @ViewChild('right') right!: ElementRef<HTMLDivElement>;

  animateImg() {
    const rightWidth = this.right.nativeElement.offsetWidth;

    gsap.from('.left', {
      x: rightWidth,
      duration: 1,
      ease: 'power2.inOut',
    });

    gsap.from('.right', {
      x: -rightWidth,
      duration: 1,
      ease: 'power2.inOut',
    });
  }
}

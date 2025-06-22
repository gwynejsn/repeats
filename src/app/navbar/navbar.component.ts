import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { selectIsLoggedIn } from '../user/state/user.selectors';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private store$ = inject(Store);
  isLoggedIn$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.store$.pipe(select(selectIsLoggedIn));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}

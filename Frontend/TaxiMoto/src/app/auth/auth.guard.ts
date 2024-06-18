import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    
    // Check if user is authenticated
    if (currentUser) {
      // Get the roles allowed for this route
      const allowedRoles = route.data['roles'] as Array<string>;

      // If there are no roles specified, allow access
      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      // Check if the user's role matches any of the allowed roles
      const userRoles = currentUser.roles;
      if (allowedRoles.some(role => userRoles.includes(role))) {
        return true;
      } else {
        // Redirect to a not-authorized page or some other page
        alert("Vous n'avez pas acces a cette route")
        this.router.navigate(['/login']);
        return false;
      }
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

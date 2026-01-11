import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  user: any = null;

  constructor(private api: ApiService, private router: Router) {
    // Let's fetch the user data so we can say "Hello, Name!"
    this.api.getUser().subscribe({
      next: (data) => (this.user = data),
      error: () => this.router.navigate(['/login']),
    });
  }

  logout() {
    this.api.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Logout failed', err),
    });
  }
}

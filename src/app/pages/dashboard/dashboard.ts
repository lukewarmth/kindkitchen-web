import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { WeeklyMenu } from '../../components/weekly-menu/weekly-menu';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, WeeklyMenu],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  user: any = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getUser().subscribe({
      next: (data: any) => (this.user = data),
      error: (err: any) => this.router.navigate(['/login']),
    });
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: any) => console.error('Logout failed', err),
    });
  }
}

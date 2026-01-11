import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.scss',
})
export class OrderHistory implements OnInit {
  orders: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUserOrders().subscribe({
      next: (data: any) => (this.orders = data),
      error: (err: any) => console.error('Could not fetch orders', err),
    });
  }
}

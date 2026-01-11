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
      next: (data: any) => {
        // Group items for each order before saving to the variable
        this.orders = data.map((order: any) => {
          return {
            ...order,
            groupedItems: this.groupItemsByDay(order.items),
          };
        });
      },
      error: (err: any) => console.error('Could not fetch orders', err),
    });
  }

  groupItemsByDay(items: any[]) {
    const daysOfWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    const groups: any = {};

    daysOfWeek.forEach((day) => {
      groups[day] = [];
    });

    items.forEach((item: any) => {
      if (!item.daily_menu) return;

      const dayName = item.daily_menu.day_of_week.toLowerCase();
      const typeName = item.item_type; // e.g., 'entree_a'

      // Debugging: uncomment the line below if it still doesn't work to see the names in the console
      console.log(`Looking for ${typeName} in`, item.daily_menu);

      const foodName = item.daily_menu[typeName]?.name;

      if (foodName && groups[dayName]) {
        groups[dayName].push(foodName);
      }
    });

    return groups;
  }

  // Update this to return the days in a specific order
  getDays() {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }
}

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
    daysOfWeek.forEach((day) => (groups[day] = []));

    items.forEach((item: any) => {
      const dm = item.daily_menu;
      if (!dm) return;

      const dayName = dm.day_of_week.toLowerCase();
      const type = item.item_type; // e.g. 'entree_a'

      // FALLBACK LOGIC: Try snake_case, then camelCase
      // This solves the "missing name" issue if Laravel renamed your relationships
      let foodObject = dm[type];

      if (!foodObject) {
        // Try converting entree_a to entreeA
        const camelType = type.replace(/_([a-z])/g, (g: string) => g[1].toUpperCase());
        foodObject = dm[camelType];
      }

      const foodName = foodObject?.name || 'Archived Item';

      if (groups[dayName]) {
        groups[dayName].push({
          type: type.replace('_', ' ').toUpperCase(),
          name: foodName,
        });
      }
    });

    return groups;
  }

  // Update this to return the days in a specific order
  getDays() {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }
}

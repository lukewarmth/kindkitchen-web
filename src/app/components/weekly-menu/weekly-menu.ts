import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weekly-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weekly-menu.html',
  styleUrls: ['./weekly-menu.scss'],
})
export class WeeklyMenu implements OnInit {
  menuData: any = null;
  loading: boolean = true;
  error: string = '';

  selectedItems: { [key: number]: { [key: string]: number } } = {};

  donateMeal: boolean = false;
  consentUnclaimed: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getWeeklyMenu().subscribe({
      next: (data) => {
        this.menuData = data;
        this.loading = false;
        this.menuData.daily_menus.forEach((day: any) => {
          this.selectedItems[day.id] = {};
        });
      },
      error: (err) => {
        this.error = 'No active menu found for this week.';
        this.loading = false;
      },
    });
  }

  selectItem(dayId: number, type: string, itemId: number) {
    if (this.selectedItems[dayId][type] === itemId) {
      delete this.selectedItems[dayId][type];
    } else {
      this.selectedItems[dayId][type] = itemId;
    }
  }

  submitOrder() {
    // Transform our local selection object into the format Laravel expects
    const itemsArray: any[] = [];

    Object.keys(this.selectedItems).forEach((dayId) => {
      const dayChoices = this.selectedItems[+dayId];
      Object.keys(dayChoices).forEach((type) => {
        itemsArray.push({
          daily_menu_id: +dayId,
          item_type: type,
        });
      });
    });

    const orderData = {
      donate_meal: this.donateMeal,
      consent_unclaimed_donation: this.consentUnclaimed,
      items: itemsArray,
    };

    this.api.placeOrder(orderData).subscribe({
      next: (res) => {
        alert('Order placed successfully!');
        this.router.navigate(['/dashboard']); // Refresh or redirect
      },
      error: (err) => alert('Error placing order. Please try again.'),
    });
  }
}

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

  // Track the date currently being viewed
  viewingDate: Date = new Date();

  selectedItems: { [key: number]: { [key: string]: number } } = {};

  donateMeal: boolean = false;
  consentUnclaimed: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadMenu(this.viewingDate);
  }

  loadMenu(date: Date): void {
    this.loading = true;
    this.error = '';

    // Format date as YYYY-MM-DD for the backend API
    const dateString = date.toISOString().split('T')[0];

    this.api.getWeeklyMenu(dateString).subscribe({
      next: (data) => {
        const dayOrder = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ];

        // Sort the menus based on the fixed day order
        data.daily_menus.sort((a: any, b: any) => {
          return (
            dayOrder.indexOf(a.day_of_week.toLowerCase()) -
            dayOrder.indexOf(b.day_of_week.toLowerCase())
          );
        });

        this.menuData = data;
        this.loading = false;

        // Reset and initialize selection object for this specific menu
        this.selectedItems = {};
        this.menuData.daily_menus.forEach((day: any) => {
          this.selectedItems[day.id] = {};
        });
      },
      error: (err) => {
        this.menuData = null;
        this.error = 'No active menu found for this week.';
        this.loading = false;
      },
    });
  }

  /**
   * Navigates the week by a specified number of days
   * @param offset - usually -7 or 7
   */
  changeWeek(offset: number): void {
    const newDate = new Date(this.viewingDate);
    newDate.setDate(newDate.getDate() + offset);
    this.viewingDate = newDate;
    this.loadMenu(this.viewingDate);
  }

  /**
   * Jumps back to the current week
   */
  goToday(): void {
    this.viewingDate = new Date();
    this.loadMenu(this.viewingDate);
  }

  selectItem(dayId: number, type: string, itemId: number) {
    if (this.selectedItems[dayId][type] === itemId) {
      delete this.selectedItems[dayId][type];
    } else {
      this.selectedItems[dayId][type] = itemId;
    }
  }

  submitOrder() {
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

    if (itemsArray.length === 0 && !this.donateMeal) {
      alert('Please select at least one item or choose to donate your meals.');
      return;
    }

    const orderData = {
      donate_meal: this.donateMeal,
      consent_unclaimed_donation: this.consentUnclaimed,
      items: itemsArray,
    };

    this.api.placeOrder(orderData).subscribe({
      next: (res) => {
        alert('Order placed successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert('Error placing order. Please try again.'),
    });
  }
}

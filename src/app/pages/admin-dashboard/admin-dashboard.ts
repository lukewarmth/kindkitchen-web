import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboard implements OnInit {
  menuItems: any[] = [];

  // Categorized lists for the dropdowns
  soups: any[] = [];
  entrees: any[] = [];
  desserts: any[] = [];

  // 1. YOUR ORIGINAL NEW ITEM OBJECT
  newItem = {
    name: '',
    type: 'soup',
    description: '',
  };

  // 2. NEW: WEEKLY MENU OBJECT
  newWeeklyMenu = {
    week_start_date: '',
    days: [
      {
        day_of_week: 'monday',
        soup_item_id: null,
        entree_a_item_id: null,
        entree_b_item_id: null,
        dessert_item_id: null,
      },
      {
        day_of_week: 'tuesday',
        soup_item_id: null,
        entree_a_id: null,
        entree_b_id: null,
        dessert_id: null,
      },
      {
        day_of_week: 'wednesday',
        soup_item_id: null,
        entree_a_id: null,
        entree_b_id: null,
        dessert_id: null,
      },
      {
        day_of_week: 'thursday',
        soup_item_id: null,
        entree_a_id: null,
        entree_b_id: null,
        dessert_id: null,
      },
      {
        day_of_week: 'friday',
        soup_item_id: null,
        entree_a_id: null,
        entree_b_id: null,
        dessert_id: null,
      },
      {
        day_of_week: 'saturday',
        soup_item_id: null,
        entree_a_id: null,
        entree_b_id: null,
        dessert_id: null,
      },
      {
        day_of_week: 'sunday',
        soup_item_id: null,
        entree_a_id: null,
        entree_b_id: null,
        dessert_id: null,
      },
    ],
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.api.getMenuItems().subscribe({
      next: (data) => {
        this.menuItems = data;
        // Filter items into categories for the dropdowns
        this.soups = data.filter((i) => i.type === 'soup');
        this.entrees = data.filter((i) => i.type === 'entree');
        this.desserts = data.filter((i) => i.type === 'dessert');
      },
      error: (err) => console.error('Error loading items', err),
    });
  }

  // 3. YOUR ORIGINAL ADD FOOD LOGIC
  addFood() {
    if (!this.newItem.name) return;
    this.api.createMenuItem(this.newItem).subscribe({
      next: () => {
        this.newItem = { name: '', type: 'soup', description: '' };
        this.loadItems();
      },
      error: (err) => alert('Error: ' + err.error.message),
    });
  }

  // 4. YOUR ORIGINAL REMOVE FOOD (Now acts as "Archive" thanks to SoftDeletes)
  removeFood(itemId: number) {
    if (confirm('Are you sure you want to archive this item?')) {
      this.api.deleteMenuItem(itemId).subscribe({
        next: () => this.loadItems(),
        error: (err) => alert('Error: ' + err.error.message),
      });
    }
  }

  // 5. NEW: SAVE WEEKLY MENU LOGIC
  saveWeeklyMenu() {
    if (!this.newWeeklyMenu.week_start_date) {
      alert('Please select a start date');
      return;
    }
    this.api.createWeeklyMenu(this.newWeeklyMenu).subscribe({
      next: () => {
        alert('Weekly Menu Published Successfully!');
        // Reset form optionally here
      },
      error: (err) => alert('Error creating menu: ' + err.error.message),
    });
  }
}

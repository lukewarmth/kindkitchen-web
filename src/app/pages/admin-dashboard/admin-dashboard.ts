import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  menuItems: any[] = [];
  
  // Default values for a new item
  newItem = {
    name: '',
    type: 'soup', // Default type
    description: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.api.getMenuItems().subscribe({
      next: (data) => this.menuItems = data,
      error: (err) => console.error('Error loading items', err)
    });
  }

  addFood() {
    if (!this.newItem.name) return;

    this.api.createMenuItem(this.newItem).subscribe({
      next: () => {
        // Reset form
        this.newItem = { name: '', type: 'soup', description: '' };
        // Refresh list
        this.loadItems();
      },
      error: (err) => alert('Error: ' + err.error.message)
    });
  }
}
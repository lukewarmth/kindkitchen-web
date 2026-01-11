import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api'; // Adjust path if needed

@Component({
  selector: 'app-login',
  standalone: true,
  // We MUST import ReactiveFormsModule here to use forms
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // 1. Get the CSRF cookie first (required by Laravel Sanctum)
      this.api.getCsrfToken().subscribe(() => {
        // 2. Send login request
        this.api.login(this.loginForm.value).subscribe({
          next: (user) => {
            console.log('Login successful!', user);
            // 3. Redirect to dashboard
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Login failed', err);
            this.errorMessage = 'Invalid email or password.';
          },
        });
      });
    }
  }
}

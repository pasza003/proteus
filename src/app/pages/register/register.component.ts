import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ProteusUser } from '../../shared/models/proteus-user';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private readonly authService: AuthService) {}

  public readonly registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  public register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as Omit<ProteusUser, 'role'>);
    }
  }
}

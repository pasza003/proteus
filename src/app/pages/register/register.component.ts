import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { Curriculum } from '../../shared/models/curriculum';
import { Organisation } from '../../shared/models/organisation';
import { RegisterRequest } from '../../shared/models/proteus-user';
import { AuthService } from '../../shared/services/auth.service';
import { OrganisationService } from '../../shared/services/organisation.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatSelectModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public readonly organisations: Signal<Organisation[]>;
  public readonly registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  public readonly curriculumsForSelectedOrg = signal<Curriculum[]>([]);

  constructor(
    private readonly authService: AuthService,
    private readonly organisationService: OrganisationService
  ) {
    this.organisations = toSignal(this.organisationService.organisations$, { initialValue: [] });
  }

  public register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as RegisterRequest);
    }
  }
}

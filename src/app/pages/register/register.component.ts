import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Curriculum } from '../../shared/models/curriculum';
import { Organisation, OrganisationCurriculums } from '../../shared/models/organisation';
import { RegisterRequest } from '../../shared/models/proteus-user';
import { AuthService } from '../../shared/services/auth.service';
import { CurriculumService } from '../../shared/services/curriculum.service';
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
export class RegisterComponent implements OnInit {
  public readonly organisations: Signal<Organisation[]>;
  public readonly registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    organisationId: new FormControl('', [Validators.required]),
    curriculumId: new FormControl('', [Validators.required]),
  });
  public readonly curriculumsForSelectedOrg = signal<Curriculum[]>([]);

  constructor(
    private readonly authService: AuthService,
    private readonly organisationService: OrganisationService,
    private readonly curriculumService: CurriculumService
  ) {
    this.organisations = toSignal(this.organisationService.organisations$, { initialValue: [] });
  }

  public ngOnInit(): void {
    this.registerForm.get('organisationId')?.valueChanges.subscribe((orgId: string | null) => {
      if (!orgId) {
        this.curriculumsForSelectedOrg.set([]);
        return;
      }

      this.organisationService
        .getOrganisationCurriculumns(orgId)
        .pipe(
          map((links: OrganisationCurriculums[]) => links.map(link => link.curriculumId)),
          switchMap((curriculumIds: string[]) => this.curriculumService.filter(curriculumIds))
        )
        .subscribe(curriculums => {
          this.curriculumsForSelectedOrg.set(curriculums);

          const current = this.registerForm.get('curriculumId')?.value;
          if (!curriculums.find(c => c.id === current)) {
            this.registerForm.get('curriculumId')?.setValue(null);
          }
        });
    });
  }

  public register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as RegisterRequest);
    }
  }
}

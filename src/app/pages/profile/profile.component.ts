import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, switchMap } from 'rxjs';
import { Organisation } from '../../shared/models/organisation';
import { ProteusUser } from '../../shared/models/proteus-user';
import { AuthService } from '../../shared/services/auth.service';
import { OrganisationService } from '../../shared/services/organisation.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, CommonModule, MatDividerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  public readonly user: Signal<ProteusUser | null>;
  public readonly organisations: Signal<Organisation[] | null>;
  public readonly organisation: Signal<Organisation | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly organisationService: OrganisationService
  ) {
    this.organisations = toSignal(organisationService.organisations$, { initialValue: null });

    const user$: Observable<ProteusUser | null> = this.authService.currentUser();
    const organisation$: Observable<Organisation | null> = user$.pipe(
      switchMap(user => {
        return this.organisationService.getById(user!.organisation);
      })
    );

    this.organisation = toSignal(organisation$, { initialValue: null });
    this.user = toSignal(user$, { initialValue: null });
  }
}

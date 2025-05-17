import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Observable, switchMap } from 'rxjs';
import { Curriculum } from '../../shared/models/curriculum';
import { Organisation } from '../../shared/models/organisation';
import { ProteusUser } from '../../shared/models/proteus-user';
import { AuthService } from '../../shared/services/auth.service';
import { CurriculumService } from '../../shared/services/curriculum.service';
import { OrganisationService } from '../../shared/services/organisation.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, CommonModule, MatDividerModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  public readonly user: Signal<ProteusUser | null>;
  public readonly organisations: Signal<Organisation[] | null>;
  public readonly organisation: Signal<Organisation | null>;
  public readonly curriculum: Signal<Curriculum | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly organisationService: OrganisationService,
    private readonly curriculumService: CurriculumService
  ) {
    this.organisations = toSignal(organisationService.organisations$, { initialValue: null });

    const user$: Observable<ProteusUser | null> = this.authService.currentUser();
    const organisation$: Observable<Organisation | null> = user$.pipe(switchMap(user => this.organisationService.getById(user!.organisation)));
    const curriculum$: Observable<Curriculum | null> = user$.pipe(switchMap(user => this.curriculumService.getById(user!.curriculum)));

    this.user = toSignal(user$, { initialValue: null });
    this.organisation = toSignal(organisation$, { initialValue: null });
    this.curriculum = toSignal(curriculum$, { initialValue: null });
  }
}
